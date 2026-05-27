import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InnovationPhase2Document = InnovationPhase2 & Document;

@Schema({ timestamps: true })
export class InnovationPhase2 {
  @Prop({ required: true, trim: true })
  orgName: string;

  @Prop({ required: true, trim: true })
  uploadedBy: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  youtubeLink: string;

  @Prop({ required: true, trim: true })
  driveLink: string;
}

export const InnovationPhase2Schema = SchemaFactory.createForClass(InnovationPhase2);
