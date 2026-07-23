import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JudgeScoreRound } from '../schemas/judge-score.schema';

export class CreateJudgeScoreDto {
  @ApiProperty({ description: 'Phase 2 submission _id' })
  @IsString()
  @IsNotEmpty()
  applicantId: string;

  @ApiProperty({ description: 'Challenge track name' })
  @IsString()
  @IsNotEmpty()
  track: string;

  @ApiPropertyOptional({
    description: 'Judging round for this score',
    enum: JudgeScoreRound,
    default: JudgeScoreRound.FINALIST,
  })
  @IsOptional()
  @IsEnum(JudgeScoreRound)
  round?: JudgeScoreRound;

  @ApiProperty({
    description: 'Map of criterion key → numeric score',
    example: { problemClarity: 18, innovation: 16 },
  })
  @IsObject()
  scores: Record<string, number>;

  @ApiProperty({ description: 'Sum of all criterion scores (validated server-side)' })
  @IsNumber()
  totalScore: number;

  @ApiPropertyOptional({ description: 'Free-text remarks / feedback' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
