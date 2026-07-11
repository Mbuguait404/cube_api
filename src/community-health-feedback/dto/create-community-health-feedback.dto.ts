import { IsEnum, IsOptional, IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommunityHealthFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ enum: ['Male', 'Female', 'Other', 'Prefer not to say'] })
  @IsEnum(['Male', 'Female', 'Other', 'Prefer not to say'])
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  countyOfResidence: string;

  @ApiProperty({ enum: ['Community Health Volunteer (CHV)', 'Community Health Assistant (CHA)', 'Youth (18-35)', 'Health Worker', 'Entrepreneur', 'Student', 'Other'] })
  @IsEnum(['Community Health Volunteer (CHV)', 'Community Health Assistant (CHA)', 'Youth (18-35)', 'Health Worker', 'Entrepreneur', 'Student', 'Other'])
  beneficiaryCategory: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  communityHealthChallenge: string;

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
  expectedBeneficiaries: string;

  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsEnum(['Yes', 'No'])
  willingToParticipateFully: string;

  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsEnum(['Yes', 'No'])
  previouslyParticipated: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  previousParticipationDetails?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  desiredCommunityChange: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  agreeToBeContacted?: boolean;
}
