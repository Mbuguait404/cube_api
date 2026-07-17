import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHackathonFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  teamName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  solutionName!: string;

  @ApiProperty({
    enum: [
      'Climate smart and sustainable agricultural technologies',
      'Smart cities and urban technologies',
      'Fintech and digital economy',
      'Healthtech and Biomedical innovation',
      'Social Impact and Tourism Development',
    ],
  })
  @IsEnum([
    'Climate smart and sustainable agricultural technologies',
    'Smart cities and urban technologies',
    'Fintech and digital economy',
    'Healthtech and Biomedical innovation',
    'Social Impact and Tourism Development',
  ])
  theme!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feedback?: string;
}
