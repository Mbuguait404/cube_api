import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublicVoteDocument = PublicVote & Document;

@Schema({ timestamps: true })
export class PublicVote {
  /** Phase2 submission _id of the finalist being voted for */
  @Prop({ required: true, index: true })
  applicantId: string;

  /** Challenge track (denormalised for fast aggregation) */
  @Prop({ required: true, trim: true })
  track: string;

  /** SHA-256 hash of browser fingerprint + IP — anonymous unique voter identifier */
  @Prop({ required: true, index: true })
  voterHash: string;

  /** Raw IP address for rate-limiting / fraud detection */
  @Prop({ required: true })
  ipAddress: string;

  /** User-Agent string for audit trail */
  @Prop({ default: '' })
  userAgent: string;

  /** Timestamp of the vote */
  @Prop({ default: () => new Date() })
  votedAt: Date;
}

export const PublicVoteSchema = SchemaFactory.createForClass(PublicVote);

// One vote per voter per category
PublicVoteSchema.index({ track: 1, voterHash: 1 }, { unique: true });
