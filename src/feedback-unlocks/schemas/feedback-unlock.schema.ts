import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackUnlockDocument = FeedbackUnlock & Document;

@Schema({ timestamps: true })
export class FeedbackUnlock {
  @Prop({ required: true, unique: true, trim: true })
  eventSlug!: string;

  @Prop({ type: Map, of: Boolean, default: new Map() })
  days!: Map<string, boolean>;
}

export const FeedbackUnlockSchema = SchemaFactory.createForClass(FeedbackUnlock);
