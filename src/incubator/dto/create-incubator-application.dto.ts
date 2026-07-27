import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationType } from '../schemas/incubator-application.schema';

export class CreateIncubatorApplicationDto {
  @ApiProperty({ enum: ApplicationType })
  @IsEnum(ApplicationType)
  type: ApplicationType;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  idea?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  track?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  link?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  organization?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  proposal?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  expertise?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  bio?: string;
}
