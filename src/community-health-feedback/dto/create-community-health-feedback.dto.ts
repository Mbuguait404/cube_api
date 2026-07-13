import { IsEnum, IsOptional, IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunityHealthFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty({ enum: ['Male', 'Female', 'Other', 'Prefer not to say'] })
  @IsEnum(['Male', 'Female', 'Other', 'Prefer not to say'])
  gender!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subCounty!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ward!: string;

  @ApiProperty({ enum: ['Health Leadership, Employment & Sustainability', 'Innovations & Product Development', 'Health Entrepreneurship & Enterprise Development', 'Community Health Improvement (Challenges & Opportunities)'] })
  @IsEnum(['Health Leadership, Employment & Sustainability', 'Innovations & Product Development', 'Health Entrepreneurship & Enterprise Development', 'Community Health Improvement (Challenges & Opportunities)'])
  beneficiaryCategory!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  communityHealthChallenge!: string;

  @ApiPropertyOptional({ enum: ['Yes', 'No', ''] })
  @IsOptional()
  @IsString()
  hasExistingIdea?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  existingIdeaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reasonToParticipate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  planToApplyKnowledge?: string;

  @ApiProperty({ enum: ['1-10', '11-50', '51-100', '101-500', '500+'] })
  @IsEnum(['1-10', '11-50', '51-100', '101-500', '500+'])
  expectedBeneficiaries!: string;

  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsEnum(['Yes', 'No'])
  willingToParticipateFully!: string;

  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsEnum(['Yes', 'No'])
  previouslyParticipated!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  previousParticipationDetails?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  desiredCommunityChange!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  agreeToBeContacted?: boolean;
}
