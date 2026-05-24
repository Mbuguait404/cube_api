import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationPreferenceDocument = NotificationPreference & Document;

@Schema({
  _id: false,
})
class ChannelPreference {
  @Prop({ type: Boolean, default: true })
  inApp: boolean;

  @Prop({ type: Boolean, default: true })
  email: boolean;

  @Prop({ type: Boolean, default: false })
  sms: boolean;
}

@Schema({ timestamps: true })
export class NotificationPreference {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  user: Types.ObjectId;

  @Prop({
    type: ChannelPreference,
    default: () => ({ inApp: true, email: true, sms: false }),
  })
  tasks: ChannelPreference;

  @Prop({
    type: ChannelPreference,
    default: () => ({ inApp: true, email: true, sms: false }),
  })
  comments: ChannelPreference;

  @Prop({
    type: ChannelPreference,
    default: () => ({ inApp: true, email: true, sms: false }),
  })
  dailyReports: ChannelPreference;

  @Prop({
    type: ChannelPreference,
    default: () => ({ inApp: true, email: true, sms: false }),
  })
  badges: ChannelPreference;

  @Prop({
    type: ChannelPreference,
    default: () => ({ inApp: true, email: true, sms: false }),
  })
  announcements: ChannelPreference;
}

export const NotificationPreferenceSchema = SchemaFactory.createForClass(NotificationPreference);
