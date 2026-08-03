import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CirisApplicationDocument = CirisApplication & Document;

@Schema({ timestamps: true })
export class CirisApplication {
  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ trim: true })
  organization?: string;

  @Prop({ required: true, trim: true })
  teamSize!: string;

  @Prop({ required: true, trim: true })
  challengeTrack!: string;

  @Prop({ required: true, trim: true })
  projectTitle!: string;

  @Prop({ required: true, trim: true })
  innovationDescription!: string;

  @Prop({ trim: true })
  projectStage?: string;

  @Prop({ trim: true })
  demoLink?: string;

  @Prop({ enum: ['Yes', 'No'], default: 'No' })
  everPitched!: string;

  @Prop({ enum: ['Yes', 'No'], default: 'No' })
  raisedFunds!: string;

  @Prop({ trim: true })
  activeDuration?: string;

  @Prop({ enum: ['Yes', 'No'], default: 'No' })
  isCommercialized!: string;

  @Prop({ enum: ['Yes', 'No'], default: 'No' })
  earnedMoney!: string;

  @Prop({ trim: true })
  commercializationStage?: string;

  @Prop({ enum: ['submitted', 'reviewed', 'shortlisted', 'rejected'], default: 'submitted' })
  status!: string;

  @Prop({ default: null })
  submittedAt?: Date;
}

export const CirisApplicationSchema = SchemaFactory.createForClass(CirisApplication);
