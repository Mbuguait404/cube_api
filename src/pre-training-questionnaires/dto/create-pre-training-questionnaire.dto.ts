import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePreTrainingQuestionnaireDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ageGroup?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  county?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subCounty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hasBusinessIdea?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  healthChallenge?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  knowledgeLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priorTraining?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  expectations?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skillsWanted?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  applicationPlans?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  participationReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  attendanceCommitment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  attendanceReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamOrIndividual?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
