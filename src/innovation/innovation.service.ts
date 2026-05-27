import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InnovationPhase2, InnovationPhase2Document } from './schemas/innovation-phase2.schema';
import { CreateInnovationPhase2Dto } from './dto/create-innovation-phase2.dto';

@Injectable()
export class InnovationService {
  constructor(
    @InjectModel(InnovationPhase2.name)
    private readonly model: Model<InnovationPhase2Document>,
  ) {}

  async create(dto: CreateInnovationPhase2Dto): Promise<InnovationPhase2> {
    const created = new this.model(dto);
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

  async findOne(id: string): Promise<InnovationPhase2> {
    const item = await this.model.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Phase 2 submission not found`);
    }
    return item;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Phase 2 submission not found`);
    }
    return { success: true };
  }
}
