import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { FeedbackSubmissionsService } from './feedback-submissions.service';
import { CreateFeedbackSubmissionDto } from './dto/create-feedback-submission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Feedback Submissions')
@Controller('feedback-submissions')
export class FeedbackSubmissionsController {
  constructor(private readonly service: FeedbackSubmissionsService) {}

  /** Public endpoint — no auth required so attendees can submit without logging in */
  @Post()
  @ApiOperation({ summary: 'Submit feedback for a training day (public)' })
  create(@Body() dto: CreateFeedbackSubmissionDto) {
    return this.service.create(dto);
  }

  /** Admin-only — view all submissions, optionally filtered by day */
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all feedback submissions (admin)' })
  @ApiQuery({ name: 'day', required: false, enum: ['1', '2', '3'] })
  findAll(@Query('day') day?: string) {
    return this.service.findAll(day);
  }

  /** Admin-only — summary counts per day */
  @Get('counts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get submission counts grouped by day (admin)' })
  countByDay() {
    return this.service.countByDay();
  }

  /** Admin-only — delete a single submission */
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a feedback submission (admin)' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.service.deleteOne(id);
  }
}
