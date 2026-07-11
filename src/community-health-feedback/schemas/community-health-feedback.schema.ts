import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommunityHealthFeedbackDocument = CommunityHealthFeedback & Document;

@Schema({ timestamps: true })
export class CommunityHealthFeedback {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] })
  gender: string;

  @Prop({ required: true, trim: true })
  phoneNumber: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  countyOfResidence: string;

  @Prop({ required: true, enum: ['Health Leadership, Employment & Sustainability', 'Innovations & Product Development', 'Health Entrepreneurship & Enterprise Development', 'Community Health Improvement (Challenges & Opportunities)'] })
  beneficiaryCategory: string;

  @Prop({ required: true })
  communityHealthChallenge: string;

  @Prop({ enum: ['Yes', 'No', ''] })
  hasExistingIdea: string;

  @Prop()
  existingIdeaDescription: string;

  @Prop()
  reasonToParticipate: string;

  @Prop()
  planToApplyKnowledge: string;

  @Prop({ required: true, enum: ['1-10', '11-50', '51-100', '101-500', '500+'] })
  expectedBeneficiaries: string;

  @Prop({ required: true, enum: ['Yes', 'No'] })
  willingToParticipateFully: string;

  @Prop({ required: true, enum: ['Yes', 'No'] })
  previouslyParticipated: string;

  @Prop()
  previousParticipationDetails: string;

  @Prop({ required: true })
  desiredCommunityChange: string;

  @Prop({ default: false })
  agreeToBeContacted: boolean;
}

export const CommunityHealthFeedbackSchema = SchemaFactory.createForClass(CommunityHealthFeedback);
