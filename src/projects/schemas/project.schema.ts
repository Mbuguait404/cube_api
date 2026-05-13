import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description: string;

  /** Optional: link to a special program (Remote Attachment, etc.) */
  @Prop({ type: Types.ObjectId, ref: 'Program', default: null })
  program: Types.ObjectId;

  @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Prop({ type: String, enum: ProjectPriority, default: ProjectPriority.MEDIUM })
  priority: ProjectPriority;

  @Prop()
  deadline: Date;

  /** Designated team lead */
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  teamLead: Types.ObjectId;

  /** All members assigned to this project */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  members: Types.ObjectId[];

  /** Admin who created this project */
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  /** Accent color for UI (hex) */
  @Prop({ default: '#6366f1' })
  coverColor: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
