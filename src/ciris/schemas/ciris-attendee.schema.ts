import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CirisAttendeeDocument = CirisAttendee & Document;

@Schema({ timestamps: true })
export class CirisAttendee {
  @Prop({ required: true, trim: true })
  firstName!: string;

  @Prop({ required: true, trim: true })
  lastName!: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ trim: true })
  organization?: string;
}

export const CirisAttendeeSchema = SchemaFactory.createForClass(CirisAttendee);
