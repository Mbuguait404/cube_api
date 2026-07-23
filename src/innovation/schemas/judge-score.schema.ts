import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JudgeScoreDocument = JudgeScore & Document;

export enum JudgeScoreRound {
  GENERAL = 'general',
  FINALIST = 'finalist',
}

@Schema({ timestamps: true })
export class JudgeScore {
  /** Phase2 submission _id */
  @Prop({ required: true, index: true })
  applicantId: string;

  /** Challenge track (denormalised for easy leaderboard queries) */
  @Prop({ required: true, trim: true })
  track: string;

  /** Ref to the User who is judging */
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  judgeId: Types.ObjectId;

  /** Denormalised display name so leaderboard works even without a populate */
  @Prop({ required: true, trim: true })
  judgeName: string;

  /** Judging round this score belongs to */
  @Prop({
    type: String,
    enum: JudgeScoreRound,
    default: JudgeScoreRound.GENERAL,
    index: true,
  })
  round: JudgeScoreRound;

  /** Map of criterion key → score value */
  @Prop({ type: Map, of: Number, default: {} })
  scores: Map<string, number>;

  /** Pre-computed sum of all criterion scores */
  @Prop({ default: 0 })
  totalScore: number;

  /** Free-text feedback */
  @Prop({ default: '' })
  remarks: string;

  /** When the judge first submitted (not changed on update) */
  @Prop({ default: null })
  submittedAt: Date;

  /** Touched every time the judge saves */
  @Prop({ default: null })
  lastUpdatedAt: Date;
}

export const JudgeScoreSchema = SchemaFactory.createForClass(JudgeScore);

// Compound unique index — one score record per judge per applicant
JudgeScoreSchema.index({ applicantId: 1, judgeId: 1, round: 1 }, { unique: true });
