import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSmeLoopFeedbackDto } from './dto/create-sme-loop-feedback.dto';
import { SmeLoopFeedback, SmeLoopFeedbackDocument } from './schemas/sme-loop-feedback.schema';

@Injectable()
export class SmeLoopFeedbackService {
  constructor(
    @InjectModel(SmeLoopFeedback.name)
    private readonly feedbackModel: Model<SmeLoopFeedbackDocument>,
  ) {}

  async create(createDto: CreateSmeLoopFeedbackDto): Promise<SmeLoopFeedback> {
    const created = new this.feedbackModel(createDto);
    return created.save();
  }

  async findAll(): Promise<SmeLoopFeedback[]> {
    return this.feedbackModel.find().sort({ createdAt: -1 }).exec();
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.feedbackModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Feedback #${id} not found`);
    }
  }
}
