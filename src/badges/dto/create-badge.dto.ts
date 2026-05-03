import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BadgeTrigger } from '../schemas/badge.schema';

export class CreateBadgeDto {
  @ApiProperty({ example: 'Innovation Champion' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @ApiPropertyOptional({ default: '#6366f1' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    enum: BadgeTrigger,
    default: BadgeTrigger.MANUAL,
    description: 'When manual, admins assign it. Otherwise auto-assigned on event.',
  })
  @IsOptional()
  @IsEnum(BadgeTrigger)
  trigger?: BadgeTrigger;
}
