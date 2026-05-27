import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateInnovationPhase2Dto {
  @IsNotEmpty()
  @IsString()
  orgName: string;

  @IsNotEmpty()
  @IsString()
  uploadedBy: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsUrl()
  youtubeLink: string;

  @IsNotEmpty()
  @IsUrl()
  driveLink: string;
}
