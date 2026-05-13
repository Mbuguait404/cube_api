import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DailyReportDocument = DailyReport & Document;

export enum ReportMood {
  GREAT = 'great',
  GOOD = 'good',
  NEUTRAL = 'neutral',
  STRESSED = 'stressed',
}

export enum ReportStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}

@Schema({ timestamps: true })
export class DailyReport {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  /** Normalised to midnight UTC so one doc per member per project per day */
  @Prop({ required: true })
  date: Date;

  @Prop({ trim: true })
  accomplishments: string;

  @Prop({ trim: true })
  challenges: string;

  @Prop({ trim: true })
  nextSteps: string;

  /** Tasks the member worked on today */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
  tasksWorkedOn: Types.ObjectId[];

  @Prop({ default: 0, min: 0, max: 24 })
  hoursLogged: number;

  @Prop({ type: String, enum: ReportMood, default: ReportMood.GOOD })
  mood: ReportMood;

  @Prop({ type: String, enum: ReportStatus, default: ReportStatus.DRAFT })
  status: ReportStatus;
}

export const DailyReportSchema = SchemaFactory.createForClass(DailyReport);

// Compound unique index: one report per author per project per day
DailyReportSchema.index(
  { author: 1, project: 1, date: 1 },
  { unique: true },
);
