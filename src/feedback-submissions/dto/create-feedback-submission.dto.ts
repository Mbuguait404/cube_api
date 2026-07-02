import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeedbackSubmissionDto {
  @ApiProperty({ enum: ['1', '2', '3'], description: 'Training day' })
  @IsEnum(['1', '2', '3'])
  day: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyLearnings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  impactfulSession?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  application?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  challenges?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supportNeeded?: string;

  @ApiPropertyOptional({ enum: ['1', '2', '3'] })
  @IsOptional()
  @IsString()
  ratingContent?: string;

  @ApiPropertyOptional({ enum: ['1', '2', '3'] })
  @IsOptional()
  @IsString()
  ratingFacilitation?: string;

  @ApiPropertyOptional({ enum: ['1', '2', '3'] })
  @IsOptional()
  @IsString()
  ratingParticipation?: string;

  @ApiPropertyOptional({ enum: ['1', '2', '3'] })
  @IsOptional()
  @IsString()
  ratingMethods?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workedWell?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  improvement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  personalReflection?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @ApiPropertyOptional({ enum: ['Very Useful', 'Useful', 'Moderately useful', 'Not useful'] })
  @IsOptional()
  @IsString()
  usefulness?: string;
}
