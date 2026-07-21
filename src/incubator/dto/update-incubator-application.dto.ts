import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../schemas/incubator-application.schema';

export class UpdateIncubatorApplicationStatusDto {
  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional() @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  adminNotes?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  cohortId?: string;
}
