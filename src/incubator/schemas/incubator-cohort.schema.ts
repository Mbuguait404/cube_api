import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IncubatorCohortDocument = IncubatorCohort & Document;

export enum CohortStatus {
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class IncubatorCohort {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: String, enum: CohortStatus, default: CohortStatus.UPCOMING })
  status: CohortStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  members: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const IncubatorCohortSchema = SchemaFactory.createForClass(IncubatorCohort);
