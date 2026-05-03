import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  MEMBER = 'Member',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  institution: string;

  @Prop()
  designation: string;

  @Prop()
  profilePhoto: string;

  @Prop({ type: Object })
  address: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };

  @Prop({ type: String, enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Prop({ default: false })
  isFirstLogin: boolean;

  @Prop({ default: false })
  mustChangePassword: boolean;

  @Prop()
  tempPasswordExpiry: Date;

  /** CMS application ID for cross-reference */
  @Prop()
  cmsApplicationId: string;

  /** Communities this member belongs to */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Community' }] })
  communities: Types.ObjectId[];

  /** Badges earned */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Badge' }] })
  badges: Types.ObjectId[];

  /** Cached profile completion % — updated on profile changes */
  @Prop({ default: 0 })
  profileCompletion: number;

  /** Refresh token hash stored server-side */
  @Prop({ select: false })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual: full name
UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});
