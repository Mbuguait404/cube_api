import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  statusCode: number;

  @Prop()
  duration: number;

  @Prop()
  ip: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop()
  userEmail: string;

  @Prop({ type: Object })
  requestBody: any;

  @Prop({ type: Object })
  requestParams: any;

  @Prop({ type: Object })
  requestQuery: any;

  @Prop({ type: Object })
  responseBody: any;

  @Prop()
  userAgent: string;

  @Prop()
  errorStack: string;

  @Prop()
  errorMessage: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
