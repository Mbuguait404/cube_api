import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BadgeDocument = Badge & Document;

export enum BadgeTrigger {
  MANUAL = 'manual',
  INNOVATION_CHALLENGE = 'innovation_challenge_completion',
  PROFILE_COMPLETE = 'profile_complete',
  FIRST_LOGIN = 'first_login',
}

@Schema({ timestamps: true })
export class Badge {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop()
  iconUrl: string;

  @Prop({ default: '#6366f1' })
  color: string;

  @Prop({
    type: String,
    enum: BadgeTrigger,
    default: BadgeTrigger.MANUAL,
  })
  trigger: BadgeTrigger;

  @Prop({ default: true })
  isActive: boolean;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
