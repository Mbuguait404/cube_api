import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CirisApplication, CirisApplicationDocument } from './schemas/ciris-application.schema';
import { CirisAttendee, CirisAttendeeDocument } from './schemas/ciris-attendee.schema';
import { CreateCirisApplicationDto } from './dto/create-ciris-application.dto';
import { CreateCirisAttendeeDto } from './dto/create-ciris-attendee.dto';

@Injectable()
export class CirisService {
  private readonly logger = new Logger(CirisService.name);

  constructor(
    @InjectModel(CirisApplication.name)
    private readonly model: Model<CirisApplicationDocument>,
    @InjectModel(CirisAttendee.name)
    private readonly attendeeModel: Model<CirisAttendeeDocument>,
  ) {}

  async create(dto: CreateCirisApplicationDto): Promise<CirisApplication> {
    const created = new this.model({
      ...dto,
      status: 'submitted',
      submittedAt: new Date(),
    });
    return created.save();
  }

  async findAll(page = 1, limit = 20, search?: string, status?: string, track?: string) {
    const filter: any = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { projectTitle: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (track && track !== 'all') {
      filter.challengeTrack = track;
    }

    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.model.countDocuments(filter).exec(),
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

  async findOne(id: string): Promise<CirisApplication> {
    const item = await this.model.findById(id).exec();
    if (!item) {
      throw new NotFoundException('CIRIS application not found');
    }
    return item;
  }

  async updateStatus(id: string, status: string): Promise<CirisApplication> {
    const updated = await this.model
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('CIRIS application not found');
    }
    return updated;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('CIRIS application not found');
    }
    return { success: true };
  }

  // ─── Attendees ─────────────────────────────────────────────────────────────

  async createAttendee(dto: CreateCirisAttendeeDto): Promise<CirisAttendee> {
    const created = new this.attendeeModel(dto);
    return created.save();
  }

  async findAllAttendees(page = 1, limit = 20, search?: string) {
    const filter: any = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const [data, total] = await Promise.all([
      this.attendeeModel
        .find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.attendeeModel.countDocuments(filter).exec(),
    ]);
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async removeAttendee(id: string): Promise<{ success: boolean }> {
    const result = await this.attendeeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('CIRIS attendee not found');
    }
    return { success: true };
  }

  async getAttendeeStats() {
    const total = await this.attendeeModel.countDocuments().exec();
    return { total };
  }

  // ─── Stats ─────────────────────────────────────────────────────────────────

  async getStats() {
    const [
      total,
      byTrack,
      byStatus,
      byStage,
    ] = await Promise.all([
      this.model.countDocuments().exec(),
      this.model.aggregate([
        { $group: { _id: '$challengeTrack', count: { $sum: 1 } } },
      ]),
      this.model.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.model.aggregate([
        { $group: { _id: '$projectStage', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      total,
      byTrack: byTrack.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {}),
      byStatus: byStatus.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {}),
      byStage: byStage.reduce((acc, cur) => ({ ...acc, [cur._id || 'Unknown']: cur.count }), {}),
    };
  }
}
