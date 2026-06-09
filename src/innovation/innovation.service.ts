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

  async create(dto: CreateInnovationPhase2Dto): Promise<InnovationPhase2> {
    const created = new this.phase2Model(dto);
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
}
