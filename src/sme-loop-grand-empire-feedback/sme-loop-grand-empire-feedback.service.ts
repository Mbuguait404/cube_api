import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SmeLoopGrandEmpireFeedback,
  SmeLoopGrandEmpireFeedbackDocument,
} from './schemas/sme-loop-grand-empire-feedback.schema';
import { CreateSmeLoopGrandEmpireFeedbackDto } from './dto/create-sme-loop-grand-empire-feedback.dto';

@Injectable()
export class SmeLoopGrandEmpireFeedbackService {
  constructor(
    @InjectModel(SmeLoopGrandEmpireFeedback.name)
    private feedbackModel: Model<SmeLoopGrandEmpireFeedbackDocument>,
  ) {}

  async create(
    dto: CreateSmeLoopGrandEmpireFeedbackDto,
  ): Promise<SmeLoopGrandEmpireFeedbackDocument> {
    return this.feedbackModel.create(dto);
  }

  async findAll(day?: string): Promise<SmeLoopGrandEmpireFeedbackDocument[]> {
    const filter = day ? { day } : {};
    return this.feedbackModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async countByDay(): Promise<{ day: string; count: number }[]> {
    return this.feedbackModel.aggregate([
      { $group: { _id: '$day', count: { $sum: 1 } } },
      { $project: { _id: 0, day: '$_id', count: 1 } },
      { $sort: { day: 1 } },
    ]);
  }

  async deleteOne(id: string): Promise<{ message: string }> {
    await this.feedbackModel.findByIdAndDelete(id);
    return { message: 'Deleted successfully' };
  }
}
