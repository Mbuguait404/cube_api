import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SmeLoopGrandEmpireFeedbackDocument = SmeLoopGrandEmpireFeedback & Document;

@Schema({ timestamps: true })
export class SmeLoopGrandEmpireFeedback {
  @Prop({ required: true, enum: ['1', '2', '3', '4'] })
  day!: string;

  @Prop({ trim: true })
  name?: string;

  // Section A – Learning Reflection
  @Prop()
  keyLearnings?: string;

  @Prop()
  impactfulSession?: string;

  @Prop()
  application?: string;

  // Section B – Challenges and Clarifications
  @Prop()
  challenges?: string;

  @Prop()
  supportNeeded?: string;

  // Section C – Ratings (stored as "1" | "2" | "3" | "4" | "5")
  @Prop()
  ratingContent?: string;

  @Prop()
  ratingFacilitation?: string;

  @Prop()
  ratingParticipation?: string;

  @Prop()
  ratingMethods?: string;

  // Section D – Improvement Suggestions
  @Prop()
  workedWell?: string;

  @Prop()
  improvement?: string;

  // Section E – Reflection
  @Prop()
  personalReflection?: string;

  // Optional quick check
  @Prop()
  usefulness?: string;

  @Prop()
  additionalNotes?: string;
}

export const SmeLoopGrandEmpireFeedbackSchema = SchemaFactory.createForClass(SmeLoopGrandEmpireFeedback);
