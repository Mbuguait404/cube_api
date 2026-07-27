import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IncubatorService } from './incubator.service';
import { CreateIncubatorApplicationDto } from './dto/create-incubator-application.dto';

@ApiTags('Incubator')
@Controller('incubator')
export class IncubatorController {
  constructor(private incubatorService: IncubatorService) {}

  @Post('applications')
  @ApiOperation({ summary: 'Submit an incubator application (founder, partner, or mentor)' })
  submitApplication(@Body() dto: CreateIncubatorApplicationDto) {
    return this.incubatorService.submitApplication(dto);
  }
}
