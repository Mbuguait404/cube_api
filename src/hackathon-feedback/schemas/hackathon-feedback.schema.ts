import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HackathonFeedbackDocument = HackathonFeedback & Document;

@Schema({ timestamps: true })
export class HackathonFeedback {
  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ required: true, trim: true })
  teamName!: string;

  @Prop({ required: true, trim: true })
  solutionName!: string;

  @Prop({
    required: true,
    enum: [
      'Climate smart and sustainable agricultural technologies',
      'Smart cities and urban technologies',
      'Fintech and digital economy',
      'Healthtech and Biomedical innovation',
      'Social Impact and Tourism Development',
    ],
  })
  theme!: string;

  @Prop()
  feedback!: string;
}

export const HackathonFeedbackSchema =
  SchemaFactory.createForClass(HackathonFeedback);
