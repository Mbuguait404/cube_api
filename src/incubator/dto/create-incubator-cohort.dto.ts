import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CohortStatus } from '../schemas/incubator-cohort.schema';

export class CreateIncubatorCohortDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: CohortStatus, default: CohortStatus.UPCOMING })
  @IsOptional() @IsEnum(CohortStatus)
  status?: CohortStatus;
}
