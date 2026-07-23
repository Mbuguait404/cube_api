import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CastPublicVoteDto {
  @ApiProperty({ description: 'Phase 2 submission _id of the finalist' })
  @IsString()
  @IsNotEmpty()
  applicantId: string;

  @ApiProperty({ description: 'Challenge track name' })
  @IsString()
  @IsNotEmpty()
  track: string;

  @ApiProperty({ description: 'Browser fingerprint for anonymous voter identification' })
  @IsString()
  @IsNotEmpty()
  fingerprint: string;
}
