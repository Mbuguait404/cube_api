import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InnovationSettingsDocument = InnovationSettings & Document;

@Schema({ timestamps: true })
export class InnovationSettings {
  @Prop({ default: false })
  isPublicShortlistVisible: boolean;
}

export const InnovationSettingsSchema = SchemaFactory.createForClass(InnovationSettings);
