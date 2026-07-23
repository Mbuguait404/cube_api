import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHackathonFeedbackDto } from './dto/create-hackathon-feedback.dto';
import {
  HackathonFeedback,
  HackathonFeedbackDocument,
} from './schemas/hackathon-feedback.schema';

@Injectable()
export class HackathonFeedbackService {
  constructor(
    @InjectModel(HackathonFeedback.name)
    private readonly feedbackModel: Model<HackathonFeedbackDocument>,
  ) {}

  async create(
    createDto: CreateHackathonFeedbackDto,
  ): Promise<HackathonFeedback> {
    const created = new this.feedbackModel(createDto);
    return created.save();
  }

  async findAll(): Promise<HackathonFeedback[]> {
    return this.feedbackModel.find().sort({ createdAt: -1 }).exec();
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.feedbackModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Feedback #${id} not found`);
    }
  }
}
