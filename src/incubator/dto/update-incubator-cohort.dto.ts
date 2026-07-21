import { IsString, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CohortStatus } from '../schemas/incubator-cohort.schema';

export class UpdateIncubatorCohortDto {
  @ApiPropertyOptional()
  @IsOptional() @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: CohortStatus })
  @IsOptional() @IsEnum(CohortStatus)
  status?: CohortStatus;
}

export class EnrollMembersDto {
  @ApiPropertyOptional()
  @IsOptional() @IsArray()
  @IsString({ each: true })
  memberIds?: string[];
}
