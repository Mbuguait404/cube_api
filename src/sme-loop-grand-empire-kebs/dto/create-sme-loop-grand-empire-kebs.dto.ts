import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSmeLoopGrandEmpireKebsDto {
  // Section A – Applicant Information
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  emailAddress!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  county!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subCounty?: string;

  @ApiProperty({ enum: ['Male', 'Female', 'Prefer not to say'] })
  @IsNotEmpty()
  @IsEnum(['Male', 'Female', 'Prefer not to say'])
  gender!: string;

  @ApiProperty({ enum: ['18-24', '25-35', '36-45', '46+'] })
  @IsNotEmpty()
  @IsEnum(['18-24', '25-35', '36-45', '46+'])
  ageBracket!: string;

  // Section B – Business Information
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  businessName!: string;

  @ApiProperty({ enum: ['Registered', 'In the process of registration'] })
  @IsNotEmpty()
  @IsEnum(['Registered', 'In the process of registration'])
  registrationStatus!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  yearStarted?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessLocation?: string;

  @ApiProperty({
    enum: [
      'Agribusiness',
      'Food Processing',
      'Manufacturing',
      'Value Addition',
      'Cosmetics & Personal Care',
      'Herbal Products',
      'Green Economy',
      'Creative Products',
      'Other',
    ],
  })
  @IsNotEmpty()
  @IsEnum([
    'Agribusiness',
    'Food Processing',
    'Manufacturing',
    'Value Addition',
    'Cosmetics & Personal Care',
    'Herbal Products',
    'Green Economy',
    'Creative Products',
    'Other',
  ])
  businessSector!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherSector?: string;

  @ApiProperty({ enum: ['1-5', '6-10', '11-20', 'Above 20'] })
  @IsNotEmpty()
  @IsEnum(['1-5', '6-10', '11-20', 'Above 20'])
  numberOfEmployees!: string;

  // Section C – Product Information
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productsManufactured!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productDescription!: string;

  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsNotEmpty()
  @IsEnum(['Yes', 'No'])
  productBeingSold!: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  salesChannels?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherSalesChannel?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productPhotos?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  monthlyProductionUnits?: string;

  // Section D – Certification Readiness
  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsNotEmpty()
  @IsEnum(['Yes', 'No'])
  appliedKebsCertification!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kebsOutcome?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  currentDocumentation?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  licencesPermits?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherLicencePermit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  biggestChallengeKebs?: string;

  // Section E – Programme Commitment
  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsNotEmpty()
  @IsEnum(['Yes', 'No'])
  availableForSessions!: string;

  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsNotEmpty()
  @IsEnum(['Yes', 'No'])
  willingSiteVisits!: string;

  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsNotEmpty()
  @IsEnum(['Yes', 'No'])
  committedImplementing!: string;

  // Section F – Priority Categories
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  priorityCategories?: string[];

  // Section G – Short Answer
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  participationReason!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  expectedImpact!: string;

  // Declaration
  @ApiProperty({ enum: ['Yes', 'No'] })
  @IsNotEmpty()
  @IsEnum(['Yes', 'No'])
  declarationAgreed!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  declarationName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  declarationDate?: string;
}
