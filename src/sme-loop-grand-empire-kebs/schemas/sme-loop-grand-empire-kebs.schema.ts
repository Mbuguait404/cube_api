import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SmeLoopGrandEmpireKebsDocument = SmeLoopGrandEmpireKebs & Document;

@Schema({ timestamps: true })
export class SmeLoopGrandEmpireKebs {
  // Section A – Applicant Information
  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ required: true, trim: true })
  phoneNumber!: string;

  @Prop({ required: true, trim: true })
  emailAddress!: string;

  @Prop({ required: true, trim: true })
  county!: string;

  @Prop({ trim: true })
  subCounty?: string;

  @Prop({ required: true, enum: ['Male', 'Female', 'Prefer not to say'] })
  gender!: string;

  @Prop({ required: true, enum: ['18-24', '25-35', '36-45', '46+'] })
  ageBracket!: string;

  // Section B – Business Information
  @Prop({ required: true, trim: true })
  businessName!: string;

  @Prop({ required: true, enum: ['Registered', 'In the process of registration'] })
  registrationStatus!: string;

  @Prop({ trim: true })
  registrationNumber?: string;

  @Prop({ trim: true })
  yearStarted?: string;

  @Prop({ trim: true })
  businessLocation?: string;

  @Prop({ required: true, enum: ['Agribusiness', 'Food Processing', 'Manufacturing', 'Value Addition', 'Cosmetics & Personal Care', 'Herbal Products', 'Green Economy', 'Creative Products', 'Other'] })
  businessSector!: string;

  @Prop({ trim: true })
  otherSector?: string;

  @Prop({ required: true, enum: ['1-5', '6-10', '11-20', 'Above 20'] })
  numberOfEmployees!: string;

  // Section C – Product Information
  @Prop({ required: true })
  productsManufactured?: string;

  @Prop({ required: true })
  productDescription?: string;

  @Prop({ required: true, enum: ['Yes', 'No'] })
  productBeingSold!: string;

  @Prop({ type: [String], default: [] })
  salesChannels?: string[];

  @Prop({ trim: true })
  otherSalesChannel?: string;

  @Prop({ type: [String], default: [] })
  productPhotos?: string[];

  @Prop({ trim: true })
  monthlyProductionUnits?: string;

  // Section D – Certification Readiness
  @Prop({ required: true, enum: ['Yes', 'No'] })
  appliedKebsCertification!: string;

  @Prop()
  kebsOutcome?: string;

  @Prop({ type: [String], default: [] })
  currentDocumentation?: string[];

  @Prop({ type: [String], default: [] })
  licencesPermits?: string[];

  @Prop({ trim: true })
  otherLicencePermit?: string;

  @Prop()
  biggestChallengeKebs?: string;

  // Section E – Programme Commitment
  @Prop({ required: true, enum: ['Yes', 'No'] })
  availableForSessions!: string;

  @Prop({ required: true, enum: ['Yes', 'No'] })
  willingSiteVisits!: string;

  @Prop({ required: true, enum: ['Yes', 'No'] })
  committedImplementing!: string;

  // Section F – Priority Categories
  @Prop({ type: [String], default: [] })
  priorityCategories?: string[];

  // Section G – Short Answer
  @Prop({ required: true })
  participationReason?: string;

  @Prop({ required: true })
  expectedImpact?: string;

  // Declaration
  @Prop({ required: true, enum: ['Yes', 'No'] })
  declarationAgreed!: string;

  @Prop({ trim: true })
  declarationName?: string;

  @Prop({ trim: true })
  declarationDate?: string;
}

export const SmeLoopGrandEmpireKebsSchema = SchemaFactory.createForClass(SmeLoopGrandEmpireKebs);
