import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';
import { NotificationPreference, NotificationPreferenceDocument } from './schemas/notification-preference.schema';
import { UpdateNotificationPreferenceDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationPreference.name) private preferenceModel: Model<NotificationPreferenceDocument>,
  ) {}

  async create(data: {
    recipient: string;
    sender?: string;
    title: string;
    message: string;
    type: NotificationType;
    targetUrl?: string;
    metadata?: Record<string, any>;
  }): Promise<NotificationDocument> {
    const payload: any = {
      recipient: new Types.ObjectId(data.recipient),
      title: data.title,
      message: data.message,
      type: data.type,
      targetUrl: data.targetUrl,
      metadata: data.metadata || {},
    };

    if (data.sender) {
      payload.sender = new Types.ObjectId(data.sender);
    }

    return this.notificationModel.create(payload);
  }

  async findAllForUser(userId: string, isRead?: boolean): Promise<NotificationDocument[]> {
    const query: any = { recipient: new Types.ObjectId(userId) };
    if (isRead !== undefined) {
      query.isRead = isRead;
    }
    return this.notificationModel
      .find(query)
      .populate('sender', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(id: string, userId: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), recipient: new Types.ObjectId(userId) },
      { isRead: true },
      { new: true },
    );
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { recipient: new Types.ObjectId(userId), isRead: false },
      { isRead: true },
    );
    return { modifiedCount: result.modifiedCount };
  }

  async getPreferences(userId: string): Promise<NotificationPreferenceDocument> {
    let pref = await this.preferenceModel.findOne({ user: new Types.ObjectId(userId) });
    if (!pref) {
      pref = await this.preferenceModel.create({
        user: new Types.ObjectId(userId),
        tasks: { inApp: true, email: true, sms: false },
        comments: { inApp: true, email: true, sms: false },
        dailyReports: { inApp: true, email: true, sms: false },
        badges: { inApp: true, email: true, sms: false },
        announcements: { inApp: true, email: true, sms: false },
      });
    }
    return pref;
  }

  async updatePreferences(
    userId: string,
    dto: UpdateNotificationPreferenceDto,
  ): Promise<NotificationPreferenceDocument> {
    const userObjectId = new Types.ObjectId(userId);
    let pref = await this.preferenceModel.findOne({ user: userObjectId });

    if (!pref) {
      pref = new this.preferenceModel({ user: userObjectId });
    }

    if (dto.tasks) {
      pref.tasks = { ...pref.tasks, ...dto.tasks };
    }
    if (dto.comments) {
      pref.comments = { ...pref.comments, ...dto.comments };
    }
    if (dto.dailyReports) {
      pref.dailyReports = { ...pref.dailyReports, ...dto.dailyReports };
    }
    if (dto.badges) {
      pref.badges = { ...pref.badges, ...dto.badges };
    }
    if (dto.announcements) {
      pref.announcements = { ...pref.announcements, ...dto.announcements };
    }

    return pref.save();
  }
}
