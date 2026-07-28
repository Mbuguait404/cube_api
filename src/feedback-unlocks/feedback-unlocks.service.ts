import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedbackUnlock, FeedbackUnlockDocument } from './schemas/feedback-unlock.schema';

@Injectable()
export class FeedbackUnlocksService {
  constructor(
    @InjectModel(FeedbackUnlock.name)
    private readonly model: Model<FeedbackUnlockDocument>,
  ) {}

  async findByEvent(eventSlug: string): Promise<FeedbackUnlockDocument | null> {
    return this.model.findOne({ eventSlug }).exec();
  }

  async getOrCreate(eventSlug: string): Promise<FeedbackUnlockDocument> {
    let doc = await this.model.findOne({ eventSlug }).exec();
    if (!doc) {
      doc = await this.model.create({ eventSlug, days: new Map() });
    }
    return doc;
  }

  async updateDays(
    eventSlug: string,
    days: Record<string, boolean>,
  ): Promise<FeedbackUnlockDocument> {
    const doc = await this.model.findOneAndUpdate(
      { eventSlug },
      { $set: { days } },
      { new: true, upsert: true },
    ).exec();
    return doc;
  }

  async remove(eventSlug: string): Promise<void> {
    const deleted = await this.model.findOneAndDelete({ eventSlug }).exec();
    if (!deleted) {
      throw new NotFoundException(`Settings for ${eventSlug} not found`);
    }
  }
}
