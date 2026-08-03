import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SmeLoopGrandEmpirePreDocument = SmeLoopGrandEmpirePre & Document;

@Schema({ timestamps: true })
export class SmeLoopGrandEmpirePre {
  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  businessName?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ enum: ['Male', 'Female', 'Prefer not to say'] })
  gender?: string;

  @Prop({ trim: true })
  county?: string;

  @Prop({ trim: true })
  subCounty?: string;

  @Prop()
  occupation?: string;

  @Prop({ enum: ['Primary', 'Secondary', 'Certificate', 'Diploma', 'Degree', 'Postgraduate', 'Other'] })
  education?: string;

  @Prop({ enum: ['Yes', 'No'] })
  hasBusiness?: string;

  @Prop()
  businessDescription?: string;

  @Prop()
  businessType?: string;

  @Prop({ enum: ['Not yet started', 'Less than 1 year', '1 - 3 years', 'Over 3 years'] })
  businessAge?: string;

  @Prop()
  biggestChallenge?: string;

  @Prop({ enum: ['None', 'Basic', 'Moderate', 'Advanced'] })
  knowledgeLevel?: string;

  @Prop({ enum: ['Yes', 'No'] })
  priorTraining?: string;

  @Prop()
  expectations?: string;

  @Prop()
  skillsWanted?: string;

  @Prop()
  applicationPlans?: string;

  @Prop()
  participationReason?: string;

  @Prop({ enum: ['Yes', 'No'] })
  attendanceCommitment?: string;

  @Prop()
  attendanceReason?: string;

  @Prop({ enum: ['Individual', 'Team'] })
  teamOrIndividual?: string;

  @Prop({ trim: true })
  teamName?: string;

  @Prop()
  additionalNotes?: string;
}

export const SmeLoopGrandEmpirePreSchema = SchemaFactory.createForClass(SmeLoopGrandEmpirePre);
