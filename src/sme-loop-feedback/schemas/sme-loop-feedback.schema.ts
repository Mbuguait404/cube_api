import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SmeLoopFeedbackDocument = SmeLoopFeedback & Document;

@Schema({ timestamps: true })
export class SmeLoopFeedback {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phoneNumber: string;

  @Prop({ required: true, trim: true })
  emailAddress: string;

  @Prop({ required: true, trim: true })
  businessName: string;

  @Prop({ required: true, enum: ['Yes', 'No'] })
  isRegistered: string;

  @Prop({ required: true, trim: true })
  businessAge: string;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop({ required: true })
  challenges: string;

  @Prop({ type: [String], required: true, default: [] })
  interests: string[];

  @Prop()
  comments: string;
}

export const SmeLoopFeedbackSchema = SchemaFactory.createForClass(SmeLoopFeedback);
