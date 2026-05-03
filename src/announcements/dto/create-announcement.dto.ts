import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsDateString,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Q3 Innovation Challenge Now Open!' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Applications are now open for Q3...' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'https://thecube.com/apply' })
  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @ApiPropertyOptional({ example: 'Apply Now' })
  @IsOptional()
  @IsString()
  ctaLabel?: string;

  @ApiPropertyOptional({
    type: [String],
    description:
      'Community IDs to target. Empty array = broadcast to all members.',
  })
  @IsOptional()
  @IsArray()
  targetCommunities?: string[];

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
