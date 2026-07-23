import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FinalistJudgeScoreDocument = FinalistJudgeScore & Document;

@Schema({ timestamps: true, collection: 'finalistjudgescores' })
export class FinalistJudgeScore {
  @Prop({ required: true, index: true })
  applicantId: string;

  @Prop({ required: true, trim: true })
  track: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  judgeId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  judgeName: string;

  @Prop({ type: Map, of: Number, default: {} })
  scores: Map<string, number>;

  @Prop({ default: 0 })
  totalScore: number;

  @Prop({ default: '' })
  remarks: string;

  @Prop({ default: null })
  submittedAt: Date;

  @Prop({ default: null })
  lastUpdatedAt: Date;
}

export const FinalistJudgeScoreSchema =
  SchemaFactory.createForClass(FinalistJudgeScore);

FinalistJudgeScoreSchema.index(
  { applicantId: 1, judgeId: 1 },
  { unique: true },
);
