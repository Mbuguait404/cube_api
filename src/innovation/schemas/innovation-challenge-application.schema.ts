import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InnovationChallengeApplicationDocument = InnovationChallengeApplication & Document;

@Schema({ timestamps: true })
export class InnovationChallengeApplication {
  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ required: true, trim: true })
  organization!: string;

  @Prop({ required: true })
  teamSize!: number;

  @Prop({ enum: ['submitted', 'reviewed', 'accepted', 'rejected'], default: 'submitted' })
  status!: string;

  @Prop({ required: true, trim: true })
  projectTitle!: string;

  @Prop({ required: true, trim: true })
  challengeTrack!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ trim: true })
  projectStage?: string;

  @Prop({ enum: ['yes', 'no'], trim: true })
  pitchedBefore?: string;

  @Prop({ enum: ['yes', 'no'], trim: true })
  raisedFunds?: string;

  @Prop({ enum: ['yes', 'no'], trim: true })
  commercialized?: string;

  @Prop({ enum: ['yes', 'no'], trim: true })
  earnedRevenue?: string;

  @Prop({ trim: true })
  projectDuration?: string;

  @Prop({ trim: true })
  commercializationStage?: string;

  @Prop({ default: null })
  submittedAt?: Date;
}

export const InnovationChallengeApplicationSchema = SchemaFactory.createForClass(InnovationChallengeApplication);
