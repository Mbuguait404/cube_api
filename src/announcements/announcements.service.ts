import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Announcement,
  AnnouncementDocument,
} from './schemas/announcement.schema';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name)
    private announcementModel: Model<AnnouncementDocument>,
  ) {}

  async create(
    dto: CreateAnnouncementDto,
    createdById: string,
  ): Promise<AnnouncementDocument> {
    return this.announcementModel.create({
      ...dto,
      createdBy: new Types.ObjectId(createdById),
    });
  }

  async findAll(): Promise<AnnouncementDocument[]> {
    return this.announcementModel
      .find()
      .populate('targetCommunities', 'name tag')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Returns announcements relevant to a member:
   *  - Global announcements (no targetCommunities set)
   *  - Announcements targeting any of the member's communities
   *  - Only active, non-expired ones
   */
  async getForCommunities(
    communityIds: Types.ObjectId[],
  ): Promise<AnnouncementDocument[]> {
    const now = new Date();
    return this.announcementModel
      .find({
        isActive: true,
        $and: [
          {
            $or: [
              { expiresAt: null },
              { expiresAt: { $gt: now } },
            ],
          },
          {
            $or: [
              { targetCommunities: { $size: 0 } },
              { targetCommunities: { $elemMatch: { $in: communityIds } } },
            ],
          },
        ],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async delete(id: string) {
    const result = await this.announcementModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Announcement not found');
    return { message: 'Announcement deleted' };
  }

  async toggleActive(id: string) {
    const ann = await this.announcementModel.findById(id);
    if (!ann) throw new NotFoundException('Announcement not found');
    ann.isActive = !ann.isActive;
    return ann.save();
  }
}
