import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Badge, BadgeDocument, BadgeTrigger } from './schemas/badge.schema';
import { CreateBadgeDto } from './dto/create-badge.dto';

@Injectable()
export class BadgesService {
  constructor(
    @InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
  ) {}

  async create(dto: CreateBadgeDto): Promise<BadgeDocument> {
    return this.badgeModel.create(dto);
  }

  async findAll(): Promise<BadgeDocument[]> {
    return this.badgeModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async findById(id: string): Promise<BadgeDocument> {
    const badge = await this.badgeModel.findById(id);
    if (!badge) throw new NotFoundException('Badge not found');
    return badge;
  }

  async findByTrigger(trigger: BadgeTrigger): Promise<BadgeDocument[]> {
    return this.badgeModel.find({ trigger, isActive: true });
  }

  async delete(id: string) {
    await this.badgeModel.findByIdAndDelete(id);
    return { message: 'Badge deleted' };
  }
}
