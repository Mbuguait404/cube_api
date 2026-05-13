import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

export enum CommentTargetType {
  TASK = 'task',
  DAILY_REPORT = 'daily_report',
}

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, enum: CommentTargetType, required: true })
  targetType: CommentTargetType;

  /** ID of the Task or DailyReport this comment belongs to */
  @Prop({ type: Types.ObjectId, required: true })
  targetId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true, trim: true })
  content: string;

  /** Users @mentioned in this comment */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  mentions: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  attachments: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Index for fast retrieval by target
CommentSchema.index({ targetType: 1, targetId: 1 });
