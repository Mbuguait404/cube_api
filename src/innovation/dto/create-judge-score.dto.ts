import { IsString, IsNotEmpty, IsObject, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJudgeScoreDto {
  @ApiProperty({ description: 'Phase 2 submission _id' })
  @IsString()
  @IsNotEmpty()
  applicantId: string;

  @ApiProperty({ description: 'Challenge track name' })
  @IsString()
  @IsNotEmpty()
  track: string;

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
