import { IsEnum, IsString } from 'class-validator';

const Statuses = ['submitted', 'reviewed', 'shortlisted', 'rejected'] as const;

export class UpdateCirisApplicationStatusDto {
  @IsString()
  @IsEnum(Statuses)
  status!: string;
}
