import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

export class CreateCirisAttendeeDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsBoolean()
  consentDataUse?: boolean;
}
