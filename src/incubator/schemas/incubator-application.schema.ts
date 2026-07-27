import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IncubatorApplicationDocument = IncubatorApplication & Document;

export enum ApplicationType {
  FOUNDER = 'founder',
  PARTNER = 'partner',
  MENTOR = 'mentor',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class IncubatorApplication {
  @Prop({ type: String, enum: ApplicationType, required: true })
  type: ApplicationType;

  @Prop({ type: String, enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @Prop({ type: Types.ObjectId, ref: 'IncubatorCohort', default: null })
  cohort: Types.ObjectId | null;

  // Common fields
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  // Founder fields
  @Prop({ trim: true })
  idea: string;

  @Prop({ trim: true })
  track: string;

  @Prop({ trim: true })
  link: string;

  // Partner fields
  @Prop({ trim: true })
  organization: string;

  @Prop({ trim: true })
  proposal: string;

  // Mentor fields
  @Prop({ trim: true })
  expertise: string;

  @Prop({ trim: true })
  bio: string;

  // Admin
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reviewedBy: Types.ObjectId | null;

  @Prop()
  reviewedAt: Date;

  @Prop({ trim: true })
  adminNotes: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  importedAsUserId: Types.ObjectId | null;
}

export const IncubatorApplicationSchema = SchemaFactory.createForClass(IncubatorApplication);
