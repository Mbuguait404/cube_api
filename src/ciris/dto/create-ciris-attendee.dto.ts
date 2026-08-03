import { IsString, IsEmail, IsOptional } from 'class-validator';

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

  consentDataUse?: boolean;
}
