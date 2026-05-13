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
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../schemas/task.schema';

export class CreateTaskDto {
  @ApiProperty({ example: 'Design wireframes for dashboard' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String], description: 'User IDs to assign' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assignees?: string[];

  @ApiPropertyOptional({ type: [String], description: 'User IDs to assign (alias for assignees)' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assigneeIds?: string[];

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: '2026-07-15' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assignees?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  assigneeIds?: string[];

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
