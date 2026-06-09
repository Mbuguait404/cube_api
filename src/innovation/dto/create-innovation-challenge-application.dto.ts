import { IsString, IsEmail, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreateInnovationChallengeApplicationDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  organization!: string;

  @IsNumber()
  teamSize!: number;

  @IsString()
  projectTitle!: string;

  @IsString()
  challengeTrack!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  projectStage?: string;

  @IsOptional()
  @IsString()
  pitchedBefore?: string;

  @IsOptional()
  @IsString()
  raisedFunds?: string;

  @IsOptional()
  @IsString()
  commercialized?: string;

  @IsOptional()
  @IsString()
  earnedRevenue?: string;

  @IsOptional()
  @IsString()
  projectDuration?: string;

  @IsOptional()
  @IsString()
  commercializationStage?: string;
}