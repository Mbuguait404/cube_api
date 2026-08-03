import { IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreateSmeLoopGrandEmpirePreDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ enum: ['Male', 'Female', 'Prefer not to say'] })
  @IsNotEmpty()
  @IsEnum(['Male', 'Female', 'Prefer not to say'])
  gender!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  county!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subCounty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiProperty({ enum: ['Primary', 'Secondary', 'Certificate', 'Diploma', 'Degree', 'Postgraduate', 'Other'] })
  @IsNotEmpty()
  @IsEnum(['Primary', 'Secondary', 'Certificate', 'Diploma', 'Degree', 'Postgraduate', 'Other'])
  education!: string;

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

  @ApiProperty({ enum: ['None', 'Basic', 'Moderate', 'Advanced'] })
  @IsNotEmpty()
  @IsEnum(['None', 'Basic', 'Moderate', 'Advanced'])
  knowledgeLevel!: string;

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

  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsNotEmpty()
  @IsEnum(['Yes', 'No'])
  attendanceCommitment!: string;

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
