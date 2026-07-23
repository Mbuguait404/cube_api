import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InnovationPhase2, InnovationPhase2Document } from './schemas/innovation-phase2.schema';
import { InnovationChallengeApplication, InnovationChallengeApplicationDocument } from './schemas/innovation-challenge-application.schema';
import { CreateInnovationPhase2Dto } from './dto/create-innovation-phase2.dto';
import { CmsBridgeService } from '../integrations/cms-bridge/cms-bridge.service';

@Injectable()
export class InnovationService {
  private readonly logger = new Logger(InnovationService.name);

  constructor(
    @InjectModel(InnovationPhase2.name)
    private readonly phase2Model: Model<InnovationPhase2Document>,
    @InjectModel(InnovationChallengeApplication.name)
    private readonly challengeApplicationModel: Model<InnovationChallengeApplicationDocument>,
    private readonly cmsBridge: CmsBridgeService,
  ) {}

  private normalize(value?: string): string {
    return (value || '').trim().toLowerCase();
  }

  private async findMatchingChallengeApplication(dto: CreateInnovationPhase2Dto) {
    const normalizedEmail = this.normalize(dto.email);
    const normalizedOrgName = this.normalize(dto.orgName);

    const result = await this.cmsBridge.getInnovationChallenges({ page: 1, limit: 50, search: dto.email });
    const candidate = result.data.find((application: any) => {
      const appEmail = this.normalize(application.email);
      const appOrganization = this.normalize(application.organization);
      return (
        (appEmail && appEmail === normalizedEmail && appOrganization === normalizedOrgName) ||
        (appEmail && appEmail === normalizedEmail)
      );
    });

    return candidate;
  }

  async create(dto: CreateInnovationPhase2Dto): Promise<InnovationPhase2> {
    let applicationId: string | undefined;
    let applicationEmail: string | undefined;
    let applicationOrganization: string | undefined;
    let matchStatus = 'unmatched';
    let matchedAt: Date | undefined;

    try {
      const match = await this.findMatchingChallengeApplication(dto);
      if (match) {
        applicationId = match._id;
        applicationEmail = match.email;
        applicationOrganization = match.organization;
        matchStatus = 'matched';
        matchedAt = new Date();
      }
    } catch (error: any) {
      this.logger.warn(`[Innovation Service] Phase 2 match attempt failed: ${error?.message || error}`);
    }

    const created = new this.phase2Model({
      ...dto,
      applicationId,
      applicationEmail,
      applicationOrganization,
      matchStatus,
      matchedAt,
    });

    return created.save();
  }

  async findAll(page = 1, limit = 20, search?: string) {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { orgName: { $regex: search, $options: 'i' } },
        { uploadedBy: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.phase2Model
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.phase2Model.countDocuments(filter).exec(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<InnovationPhase2> {
    const item = await this.phase2Model.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Phase 2 submission not found`);
    }
    return item;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const result = await this.phase2Model.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Phase 2 submission not found`);
    }
    return { success: true };
  }

  async getPhase2Progress() {
    const [totalPhase2, matchedCount] = await Promise.all([
      this.phase2Model.countDocuments().exec(),
      this.phase2Model.countDocuments({ matchStatus: 'matched' }).exec(),
    ]);

    let totalPhase1 = 0;
    try {
      const applicationsResult = await this.cmsBridge.getInnovationChallenges({ page: 1, limit: 1 });
      totalPhase1 = applicationsResult.meta.total;
    } catch (err: any) {
      this.logger.error(`[Innovation Service] Failed to fetch Phase 1 count from CMS: ${err?.message || err}`);
    }

    return {
      totalPhase1,
      totalPhase2,
      matched: matchedCount,
      unmatched: totalPhase2 - matchedCount,
      pendingPhase2: Math.max(0, totalPhase1 - matchedCount),
    };
  }

  async reconcilePhase2Matches() {
    const submissions = await this.phase2Model.find().exec();
    let updated = 0;

    for (const submission of submissions) {
      const match = await this.findMatchingChallengeApplication({
        orgName: submission.orgName,
        uploadedBy: submission.uploadedBy,
        email: submission.email,
        phone: submission.phone,
        youtubeLink: submission.youtubeLink,
        driveLink: submission.driveLink,
      } as CreateInnovationPhase2Dto);

      const newStatus = match ? 'matched' : 'unmatched';
      const newAppId = match?._id;
      const newAppEmail = match?.email;
      const newAppOrg = match?.organization;
      const newMatchedAt = match ? new Date() : undefined;

      const changed =
        submission.matchStatus !== newStatus ||
        submission.applicationId !== newAppId ||
        submission.applicationEmail !== newAppEmail ||
        submission.applicationOrganization !== newAppOrg;

      if (changed) {
        submission.matchStatus = newStatus;
        submission.applicationId = newAppId;
        submission.applicationEmail = newAppEmail;
        submission.applicationOrganization = newAppOrg;
        submission.matchedAt = newMatchedAt;
        await submission.save();
        updated += 1;
      }
    }

    return {
      total: submissions.length,
      updated,
      matched: await this.phase2Model.countDocuments({ matchStatus: 'matched' }).exec(),
      unmatched: await this.phase2Model.countDocuments({ matchStatus: 'unmatched' }).exec(),
    };
  }

  async linkPhase2ToApplication(phase2Id: string, applicationId: string) {
    const submission = await this.phase2Model.findById(phase2Id).exec();
    if (!submission) {
      throw new NotFoundException(`Phase 2 submission not found`);
    }

    let matchedApp: any | null = null;
    try {
      // Try to find the application in the CMS by id or email
      const searchResult = await this.cmsBridge.getInnovationChallenges({ page: 1, limit: 50, search: applicationId });
      matchedApp = searchResult.data.find((a: any) => {
        const idMatch = (a._id || a.id) === applicationId;
        const emailMatch = a.email && a.email.toLowerCase() === String(applicationId).toLowerCase();
        return idMatch || emailMatch;
      });
    } catch (err: any) {
      this.logger.warn(`[Innovation Service] Manual link lookup failed: ${err?.message || err}`);
    }

    if (matchedApp) {
      submission.applicationId = matchedApp._id || matchedApp.id;
      submission.applicationEmail = matchedApp.email;
      submission.applicationOrganization = matchedApp.organization;
      submission.matchStatus = 'matched';
      submission.matchedAt = new Date();
    } else {
      // Accept manual link even if CMS verification failed
      submission.applicationId = applicationId;
      submission.matchStatus = 'matched';
      submission.matchedAt = new Date();
    }

    await submission.save();
    return submission;
  }

  // ─── Innovation Challenge Applications ─────────────────────────────────────

  async createChallengeApplication(data: any): Promise<InnovationChallengeApplication> {
    const created = new this.challengeApplicationModel({
      ...data,
      submittedAt: new Date(),
    });
    return created.save();
  }

  async findAllChallengeApplications(page = 1, limit = 10, search?: string, status?: string) {
    try {
      this.logger.log(`[Innovation Service] Requesting challenge applications (page: ${page}, limit: ${limit}, search: ${search}, status: ${status})`);
      
      const result = await this.cmsBridge.getInnovationChallenges({
        page,
        limit,
        search,
        status,
      });

      this.logger.log(`[Innovation Service] Retrieved ${result.data.length} applications. Total: ${result.meta.total}`);

      return result;
    } catch (error: any) {
      this.logger.error(`[Innovation Service] Failed to fetch challenge applications: ${error?.message || error}`);
      throw error;
    }
  }

  async findOneChallengeApplication(id: string): Promise<InnovationChallengeApplication> {
    const item = await this.challengeApplicationModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Challenge application not found`);
    }
    return item;
  }

  async removeChallengeApplication(id: string): Promise<{ success: boolean }> {
    const result = await this.challengeApplicationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Challenge application not found`);
    }
    return { success: true };
  }

  async updateChallengeApplicationStatus(id: string, status: string): Promise<InnovationChallengeApplication> {
    const updated = await this.challengeApplicationModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Challenge application not found`);
    }
    return updated;
  }

  /**
   * Return a merged view containing the Phase 1 application (from CMS) and the linked Phase 2 submission (if any).
   */
  async getMergedChallengeApplication(id: string) {
    // Try to locate application in CMS by exact ID first.
    let application: any = null;
    try {
      application = await this.cmsBridge.getInnovationChallengeById(id);
    } catch (err: any) {
      this.logger.warn(`[Innovation Service] getInnovationChallengeById failed for merged view: ${err?.message || err}`);
    }

    if (!application) {
      try {
        const res = await this.cmsBridge.getInnovationChallenges({ page: 1, limit: 50, search: id });
        application = res.data.find((a: any) => (a._id || a.id) === id || String(a._id || a.id) === String(id));
        if (!application) {
          // Also try matching by email if id looks like an email
          application = res.data.find((a: any) => a.email && String(a.email).toLowerCase() === String(id).toLowerCase());
        }
      } catch (err: any) {
        this.logger.warn(`[Innovation Service] Failed to fetch application from CMS for merged view: ${err?.message || err}`);
      }
    }

    // If we didn't find it in CMS, try local collection as a fallback
    if (!application) {
      try {
        const local = await this.challengeApplicationModel.findById(id).lean().exec();
        if (local) application = local;
      } catch (err) {
        // ignore
      }
    }

    if (!application) {
      throw new NotFoundException('Challenge application not found');
    }

    // Find matching Phase 2 submission by applicationId first, then by email/organization fallbacks
    let submission = await this.phase2Model.findOne({ applicationId: application._id || application.id }).exec();

    if (!submission) {
      const appEmail = application.email && String(application.email).toLowerCase();
      const appOrg = application.organization && String(application.organization).toLowerCase();
      submission = await this.phase2Model.findOne({
        $or: [
          { applicationEmail: appEmail },
          { applicationOrganization: application.organization },
          { email: appEmail },
          { orgName: application.organization },
        ],
      }).exec();
    }

    return {
      application,
      submission: submission || null,
    };
  }
}
