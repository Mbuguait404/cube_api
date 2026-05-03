import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommunityDocument = Community & Document;

@Schema({ timestamps: true })
export class Community {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ unique: true, lowercase: true })
  slug: string;

  /** Tag used to control content visibility */
  @Prop({ required: true, unique: true, lowercase: true })
  tag: string;

  @Prop({ default: true })
  isActive: boolean;

  /** Members count — denormalized for quick reads */
  @Prop({ default: 0 })
  memberCount: number;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
