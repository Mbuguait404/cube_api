import {
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class AddressDto {
  @ApiPropertyOptional() @IsOptional() @IsString() street?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() country?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() postalCode?: string;
}

export class UpdateProfileDto {
  // ─── Section 1: Basic Info ────────────────────────────────────────────────
  @ApiPropertyOptional() @IsOptional() @IsString() firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() institution?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() designation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() profilePhoto?: string;

  @ApiPropertyOptional({ type: AddressDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  // ─── Section 2: Extended Profile ─────────────────────────────────────────
  /**
   * Free-form extended profile object. All sub-fields are optional.
   * The full structure is defined in user.schema.ts.
   */
  @ApiPropertyOptional({ type: Object, description: 'Extended profile (Section 2)' })
  @IsOptional()
  @IsObject()
  extendedProfile?: Record<string, any>;
}
