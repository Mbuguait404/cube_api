import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSmeLoopFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  emailAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsEnum(['Yes', 'No'])
  isRegistered: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  businessAge: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  challenges: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comments?: string;
}
