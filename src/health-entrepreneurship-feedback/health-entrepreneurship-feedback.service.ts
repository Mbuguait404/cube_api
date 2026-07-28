import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  HealthEntrepreneurshipFeedback,
  HealthEntrepreneurshipFeedbackDocument,
} from './schemas/health-entrepreneurship-feedback.schema';
import { CreateHealthEntrepreneurshipFeedbackDto } from './dto/create-health-entrepreneurship-feedback.dto';

@Injectable()
export class HealthEntrepreneurshipFeedbackService {
  constructor(
    @InjectModel(HealthEntrepreneurshipFeedback.name)
    private feedbackModel: Model<HealthEntrepreneurshipFeedbackDocument>,
  ) {}

  async create(
    dto: CreateHealthEntrepreneurshipFeedbackDto,
  ): Promise<HealthEntrepreneurshipFeedbackDocument> {
    return this.feedbackModel.create(dto);
  }

  async findAll(day?: string): Promise<HealthEntrepreneurshipFeedbackDocument[]> {
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
