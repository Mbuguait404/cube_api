import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FinalistShortlistDocument = FinalistShortlist & Document;

@Schema({ timestamps: true, collection: 'finalistshortlists' })
export class FinalistShortlist {
  @Prop({ required: true, trim: true })
  applicantId: string;

  @Prop({ required: true, trim: true })
  track: string;

  @Prop({ required: true, trim: true })
  finalistName: string;

  @Prop({ required: true, trim: true })
  phoneNumber: string;

  @Prop({ required: true, trim: true })
  projectTitle: string;

  @Prop({ required: true, trim: true })
  organization: string;

  @Prop({ required: true, trim: true })
  projectStage: string;

  @Prop({ type: Date, default: null })
  matchedAt: Date | null;

  @Prop({ type: Boolean, default: null })
  shortlisted: boolean | null;

  @Prop({ type: Number, default: null })
  originalRank: number | null;

  @Prop({ type: Number, default: null })
  rankOnFinalistList: number | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  linkedApplicantId: Types.ObjectId | null;
}

export const FinalistShortlistSchema = SchemaFactory.createForClass(FinalistShortlist);

FinalistShortlistSchema.index({ applicantId: 1 }, { unique: true });
