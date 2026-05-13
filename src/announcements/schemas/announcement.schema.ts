import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop()
  imageUrl: string;

  @Prop()
  ctaUrl: string;

  @Prop()
  ctaLabel: string;

  /** null or empty = broadcast to all; otherwise scoped to specific communities */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Community' }] })
  targetCommunityIds: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  expiresAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
