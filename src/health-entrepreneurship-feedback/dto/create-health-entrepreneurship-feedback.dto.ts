import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHealthEntrepreneurshipFeedbackDto {
  @ApiProperty({ enum: ['1', '2', '3'], description: 'Training day' })
  @IsEnum(['1', '2', '3'])
  day!: string;

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

  @ApiPropertyOptional({ enum: ['1', '2', '3', '4', '5'] })
  @IsOptional()
  @IsEnum(['1', '2', '3', '4', '5'])
  ratingContent?: string;

  @ApiPropertyOptional({ enum: ['1', '2', '3', '4', '5'] })
  @IsOptional()
  @IsEnum(['1', '2', '3', '4', '5'])
  ratingFacilitation?: string;

  @ApiPropertyOptional({ enum: ['1', '2', '3', '4', '5'] })
  @IsOptional()
  @IsEnum(['1', '2', '3', '4', '5'])
  ratingParticipation?: string;

  @ApiPropertyOptional({ enum: ['1', '2', '3', '4', '5'] })
  @IsOptional()
  @IsEnum(['1', '2', '3', '4', '5'])
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

  @ApiPropertyOptional({ enum: ['Very Useful', 'Useful', 'Moderately Useful', 'Not Useful'] })
  @IsOptional()
  @IsString()
  usefulness?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
