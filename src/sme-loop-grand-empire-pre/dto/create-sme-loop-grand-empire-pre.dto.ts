import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSmeLoopGrandEmpirePreDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: ['Male', 'Female', 'Prefer not to say'] })
  @IsOptional()
  @IsEnum(['Male', 'Female', 'Prefer not to say'])
  gender?: string;

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
  occupation?: string;

  @ApiPropertyOptional({ enum: ['Primary', 'Secondary', 'Certificate', 'Diploma', 'Degree', 'Postgraduate', 'Other'] })
  @IsOptional()
  @IsEnum(['Primary', 'Secondary', 'Certificate', 'Diploma', 'Degree', 'Postgraduate', 'Other'])
  education?: string;

  @ApiPropertyOptional({ enum: ['Yes', 'No'] })
  @IsOptional()
  @IsEnum(['Yes', 'No'])
  hasBusiness?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessType?: string;

  @ApiPropertyOptional({ enum: ['Not yet started', 'Less than 1 year', '1 - 3 years', 'Over 3 years'] })
  @IsOptional()
  @IsEnum(['Not yet started', 'Less than 1 year', '1 - 3 years', 'Over 3 years'])
  businessAge?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  biggestChallenge?: string;

  @ApiPropertyOptional({ enum: ['None', 'Basic', 'Moderate', 'Advanced'] })
  @IsOptional()
  @IsEnum(['None', 'Basic', 'Moderate', 'Advanced'])
  knowledgeLevel?: string;

  @ApiPropertyOptional({ enum: ['Yes', 'No'] })
  @IsOptional()
  @IsEnum(['Yes', 'No'])
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

  @ApiPropertyOptional({ enum: ['Yes', 'No'] })
  @IsOptional()
  @IsEnum(['Yes', 'No'])
  attendanceCommitment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  attendanceReason?: string;

  @ApiPropertyOptional({ enum: ['Individual', 'Team'] })
  @IsOptional()
  @IsEnum(['Individual', 'Team'])
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
