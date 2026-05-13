import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsMongoId,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportMood, ReportStatus } from '../schemas/daily-report.schema';

export class CreateDailyReportDto {
  @ApiProperty({ description: 'Project ID this report is for' })
  @IsMongoId()
  projectId: string;

  @ApiPropertyOptional({
    example: '2026-05-12',
    description: 'Defaults to today if omitted',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accomplishments?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  challenges?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextSteps?: string;

  @ApiPropertyOptional({ type: [String], description: 'Task IDs worked on today' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tasksWorkedOn?: string[];

  @ApiPropertyOptional({ example: 6, description: 'Hours logged (0–24)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(24)
  hoursLogged?: number;

  @ApiPropertyOptional({ enum: ReportMood })
  @IsOptional()
  @IsEnum(ReportMood)
  mood?: ReportMood;

  @ApiPropertyOptional({ enum: ReportStatus, description: 'draft | submitted' })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;
}

export class UpdateDailyReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accomplishments?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  challenges?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextSteps?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tasksWorkedOn?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(24)
  hoursLogged?: number;

  @ApiPropertyOptional({ enum: ReportMood })
  @IsOptional()
  @IsEnum(ReportMood)
  mood?: ReportMood;

  @ApiPropertyOptional({ enum: ReportStatus })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;
}
