import { IsString, IsEmail, IsOptional, IsEnum, IsUrl } from 'class-validator';

const YesNo = ['Yes', 'No'] as const;

export class CreateCirisApplicationDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsString()
  teamSize!: string;

  @IsString()
  challengeTrack!: string;

  @IsString()
  projectTitle!: string;

  @IsString()
  innovationDescription!: string;

  @IsOptional()
  @IsString()
  projectStage?: string;

  @IsOptional()
  @IsUrl()
  demoLink?: string;

  @IsEnum(YesNo)
  everPitched!: string;

  @IsEnum(YesNo)
  raisedFunds!: string;

  @IsOptional()
  @IsString()
  activeDuration?: string;

  @IsEnum(YesNo)
  isCommercialized!: string;

  @IsEnum(YesNo)
  earnedMoney!: string;

  @IsOptional()
  @IsString()
  commercializationStage?: string;
}
