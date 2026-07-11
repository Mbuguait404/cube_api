import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommunityHealthFeedbackDto } from './dto/create-community-health-feedback.dto';
import { CommunityHealthFeedback, CommunityHealthFeedbackDocument } from './schemas/community-health-feedback.schema';

@Injectable()
export class CommunityHealthFeedbackService {
  constructor(
    @InjectModel(CommunityHealthFeedback.name)
    private readonly feedbackModel: Model<CommunityHealthFeedbackDocument>,
  ) {}

  async create(createDto: CreateCommunityHealthFeedbackDto): Promise<CommunityHealthFeedback> {
    const created = new this.feedbackModel(createDto);
    return created.save();
  }

  async findAll(): Promise<CommunityHealthFeedback[]> {
    return this.feedbackModel.find().sort({ createdAt: -1 }).exec();
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.feedbackModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Feedback #${id} not found`);
    }
  }
}
