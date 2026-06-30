import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackSubmissionDocument = FeedbackSubmission & Document;

@Schema({ timestamps: true })
export class FeedbackSubmission {
  @Prop({ required: true, enum: ['1', '2', '3'] })
  day: string;

  @Prop({ trim: true })
  name: string;

  // Section A
  @Prop()
  keyLearnings: string;

  @Prop()
  impactfulSession: string;

  @Prop()
  application: string;

  // Section B
  @Prop()
  challenges: string;

  @Prop()
  supportNeeded: string;

  // Section C – Ratings (stored as "1" | "2" | "3")
  @Prop()
  ratingContent: string;

  @Prop()
  ratingFacilitation: string;

  @Prop()
  ratingParticipation: string;

  @Prop()
  ratingMethods: string;

  // Section D
  @Prop()
  workedWell: string;

  @Prop()
  improvement: string;

  // Section E
  @Prop()
  personalReflection: string;

  // Optional quick check
  @Prop()
  usefulness: string;
}

export const FeedbackSubmissionSchema =
  SchemaFactory.createForClass(FeedbackSubmission);
