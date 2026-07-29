import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PreTrainingQuestionnaireDocument = PreTrainingQuestionnaire & Document;

@Schema({ timestamps: true })
export class PreTrainingQuestionnaire {
  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop()
  gender?: string;

  @Prop()
  ageGroup?: string;

  @Prop({ trim: true })
  county?: string;

  @Prop({ trim: true })
  subCounty?: string;

  @Prop({ trim: true })
  ward?: string;

  @Prop()
  occupation?: string;

  @Prop()
  education?: string;

  @Prop()
  hasBusinessIdea?: string;

  @Prop()
  businessDescription?: string;

  @Prop()
  healthChallenge?: string;

  @Prop()
  knowledgeLevel?: string;

  @Prop()
  priorTraining?: string;

  @Prop()
  expectations?: string;

  @Prop()
  skillsWanted?: string;

  @Prop()
  applicationPlans?: string;

  @Prop()
  participationReason?: string;

  @Prop()
  attendanceCommitment?: string;

  @Prop()
  attendanceReason?: string;

  @Prop()
  teamOrIndividual?: string;

  @Prop()
  teamName?: string;

  @Prop()
  additionalNotes?: string;
}

export const PreTrainingQuestionnaireSchema = SchemaFactory.createForClass(PreTrainingQuestionnaire);
