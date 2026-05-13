import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentTargetType } from '../schemas/comment.schema';

export class CreateCommentDto {
  @ApiProperty({ enum: CommentTargetType })
  @IsEnum(CommentTargetType)
  targetType: CommentTargetType;

  @ApiProperty({ description: 'ID of the Task or DailyReport' })
  @IsMongoId()
  targetId: string;

  @ApiProperty({ example: 'Great progress @John, keep it up!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ type: [String], description: 'User IDs mentioned via @' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  mentions?: string[];
}
