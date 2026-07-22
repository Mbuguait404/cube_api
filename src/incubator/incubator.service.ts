import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import {
  IncubatorApplication,
  IncubatorApplicationDocument,
  ApplicationType,
  ApplicationStatus,
} from './schemas/incubator-application.schema';
import {
  IncubatorCohort,
  IncubatorCohortDocument,
  CohortStatus,
} from './schemas/incubator-cohort.schema';
import { CreateIncubatorApplicationDto } from './dto/create-incubator-application.dto';
import { UpdateIncubatorApplicationStatusDto } from './dto/update-incubator-application.dto';
import { CreateIncubatorCohortDto } from './dto/create-incubator-cohort.dto';
import { UpdateIncubatorCohortDto } from './dto/update-incubator-cohort.dto';
import { User, UserDocument, UserRole, UserStatus } from '../users/schemas/user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class IncubatorService {
  constructor(
    @InjectModel(IncubatorApplication.name)
    private applicationModel: Model<IncubatorApplicationDocument>,
    @InjectModel(IncubatorCohort.name)
    private cohortModel: Model<IncubatorCohortDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  // ─── Public: Submit Application ──────────────────────────────────────────

  async submitApplication(dto: CreateIncubatorApplicationDto) {
    return this.applicationModel.create(dto);
  }

  // ─── Dashboard Stats ─────────────────────────────────────────────────────

  async getDashboardStats() {
    const [totalFounder, totalPartner, totalMentor] = await Promise.all([
      this.applicationModel.countDocuments({ type: ApplicationType.FOUNDER }),
      this.applicationModel.countDocuments({ type: ApplicationType.PARTNER }),
      this.applicationModel.countDocuments({ type: ApplicationType.MENTOR }),
    ]);

    const [pendingFounder, pendingPartner, pendingMentor] = await Promise.all([
      this.applicationModel.countDocuments({ type: ApplicationType.FOUNDER, status: ApplicationStatus.PENDING }),
      this.applicationModel.countDocuments({ type: ApplicationType.PARTNER, status: ApplicationStatus.PENDING }),
      this.applicationModel.countDocuments({ type: ApplicationType.MENTOR, status: ApplicationStatus.PENDING }),
    ]);

    const [accepted, rejected, totalCohorts, activeCohorts] = await Promise.all([
      this.applicationModel.countDocuments({ status: ApplicationStatus.ACCEPTED }),
      this.applicationModel.countDocuments({ status: ApplicationStatus.REJECTED }),
      this.cohortModel.countDocuments(),
      this.cohortModel.countDocuments({ status: CohortStatus.ACTIVE }),
    ]);

    return {
      totalApplications: totalFounder + totalPartner + totalMentor,
      byType: { founder: totalFounder, partner: totalPartner, mentor: totalMentor },
      pending: { founder: pendingFounder, partner: pendingPartner, mentor: pendingMentor, total: pendingFounder + pendingPartner + pendingMentor },
      accepted,
      rejected,
      cohorts: { total: totalCohorts, active: activeCohorts },
    };
  }

  // ─── Applications: Admin CRUD ────────────────────────────────────────────

  async listApplications(query: {
    type?: string;
    status?: string;
    search?: string;
    cohort?: string;
    page?: number;
    limit?: number;
  }) {
    const { type, status, search, cohort, page = 1, limit = 20 } = query;
    const filter: any = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (cohort) filter.cohort = new Types.ObjectId(cohort);

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { idea: { $regex: search, $options: 'i' } },
      ];
    }

    const [applications, total] = await Promise.all([
      this.applicationModel
        .find(filter)
        .populate('cohort', 'name status')
        .populate('reviewedBy', 'firstName lastName email')
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.applicationModel.countDocuments(filter),
    ]);

    return {
      data: applications,
      meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) },
    };
  }

  async getApplicationById(id: string) {
    const app = await this.applicationModel
      .findById(id)
      .populate('cohort', 'name status')
      .populate('reviewedBy', 'firstName lastName email')
      .populate('importedAsUserId', 'firstName lastName email')
      .exec();

    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async updateApplicationStatus(
    id: string,
    dto: UpdateIncubatorApplicationStatusDto,
    adminId: string,
  ) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');

    const update: any = { reviewedBy: new Types.ObjectId(adminId), reviewedAt: new Date() };

    if (dto.status) update.status = dto.status;
    if (dto.adminNotes !== undefined) update.adminNotes = dto.adminNotes;
    if (dto.cohortId) update.cohort = new Types.ObjectId(dto.cohortId);

    const updated = await this.applicationModel
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .populate('cohort', 'name status')
      .exec();

    return updated;
  }

  async deleteApplication(id: string) {
    const app = await this.applicationModel.findByIdAndDelete(id);
    if (!app) throw new NotFoundException('Application not found');
    return { message: 'Application deleted successfully' };
  }

  // ─── Import as Member ────────────────────────────────────────────────────

  async importApplicationAsMember(id: string, adminId: string) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');
    if (app.importedAsUserId) throw new ConflictException('Application has already been imported as a member');

    const existing = await this.userModel.findOne({ email: app.email });
    if (existing) throw new ConflictException('A user with this email already exists');

    const nameParts = app.name.split(' ');
    const firstName = nameParts[0] || 'Applicant';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || 'User';

    const user = await this.userModel.create({
      firstName,
      lastName,
      email: app.email,
      phone: app.phone || '',
      password: await bcrypt.hash('PENDING_RESET', 12),
      role: UserRole.MEMBER,
      status: UserStatus.PENDING,
      mustChangePassword: true,
    });

    // Assign to cohort if specified
    if (app.cohort) {
      await this.cohortModel.findByIdAndUpdate(app.cohort, {
        $addToSet: { members: user._id },
      });
    }

    // Send temporary password
    await this.authService.sendTemporaryPassword(user._id.toString());

    // Mark application as accepted + imported
    await this.applicationModel.findByIdAndUpdate(id, {
      $set: {
        status: ApplicationStatus.ACCEPTED,
        importedAsUserId: user._id,
        reviewedBy: new Types.ObjectId(adminId),
        reviewedAt: new Date(),
      },
    });

    return { message: 'Application imported as member successfully', user };
  }

  // ─── Cohorts: Admin CRUD ─────────────────────────────────────────────────

  async listCohorts() {
    const cohorts = await this.cohortModel
      .find()
      .populate('members', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .exec();

    return cohorts.map((c) => ({
      ...c.toObject(),
      memberCount: c.members.length,
    }));
  }

  async getCohortById(id: string) {
    const cohort = await this.cohortModel
      .findById(id)
      .populate('members', 'firstName lastName email phone role status')
      .populate('createdBy', 'firstName lastName email')
      .exec();

    if (!cohort) throw new NotFoundException('Cohort not found');

    return {
      ...cohort.toObject(),
      memberCount: cohort.members.length,
    };
  }

  async createCohort(dto: CreateIncubatorCohortDto, adminId: string) {
    const cohort = await this.cohortModel.create({
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      createdBy: new Types.ObjectId(adminId),
    });
    return cohort;
  }

  async updateCohort(id: string, dto: UpdateIncubatorCohortDto) {
    const update: any = {};
    if (dto.name !== undefined) update.name = dto.name;
    if (dto.description !== undefined) update.description = dto.description;
    if (dto.startDate !== undefined) update.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) update.endDate = new Date(dto.endDate);
    if (dto.status !== undefined) update.status = dto.status;

    const cohort = await this.cohortModel
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .populate('members', 'firstName lastName email')
      .exec();

    if (!cohort) throw new NotFoundException('Cohort not found');

    return { ...cohort.toObject(), memberCount: cohort.members.length };
  }

  async deleteCohort(id: string) {
    const cohort = await this.cohortModel.findByIdAndDelete(id);
    if (!cohort) throw new NotFoundException('Cohort not found');

    // Unlink applications that referenced this cohort
    await this.applicationModel.updateMany(
      { cohort: new Types.ObjectId(id) },
      { $set: { cohort: null } },
    );

    return { message: 'Cohort deleted successfully' };
  }

  async enrollMembers(cohortId: string, memberIds: string[]) {
    const cohort = await this.cohortModel.findById(cohortId);
    if (!cohort) throw new NotFoundException('Cohort not found');

    const validObjectIds = memberIds.map((id) => new Types.ObjectId(id));

    await this.cohortModel.findByIdAndUpdate(cohortId, {
      $addToSet: { members: { $each: validObjectIds } },
    });

    const updated = await this.cohortModel
      .findById(cohortId)
      .populate('members', 'firstName lastName email')
      .exec();

    if (!updated) throw new NotFoundException('Cohort not found after enrollment');
    return { ...updated.toObject(), memberCount: updated.members.length };
  }

  async removeMember(cohortId: string, userId: string) {
    const cohort = await this.cohortModel.findByIdAndUpdate(
      cohortId,
      { $pull: { members: new Types.ObjectId(userId) } },
      { new: true },
    ).populate('members', 'firstName lastName email').exec();

    if (!cohort) throw new NotFoundException('Cohort not found');
    return { ...cohort.toObject(), memberCount: cohort.members.length };
  }
}
