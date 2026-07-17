import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HackathonFeedbackService } from './hackathon-feedback.service';
import { CreateHackathonFeedbackDto } from './dto/create-hackathon-feedback.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('hackathon-feedback')
@Controller('hackathon-feedback')
export class HackathonFeedbackController {
  constructor(
    private readonly feedbackService: HackathonFeedbackService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Submit hackathon feedback (Public)' })
  create(@Body() createDto: CreateHackathonFeedbackDto) {
    return this.feedbackService.create(createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all hackathon feedback submissions (Admin only)',
  })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a hackathon feedback submission (Admin only)',
  })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
