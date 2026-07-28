import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FeedbackUnlocksService } from './feedback-unlocks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Feedback Unlocks')
@Controller('feedback-unlocks')
export class FeedbackUnlocksController {
  constructor(private readonly service: FeedbackUnlocksService) {}

  /** Public — check if feedback days are unlocked for an event */
  @Get(':eventSlug')
  @ApiOperation({ summary: 'Get unlock status for a feedback event (public)' })
  async findOne(@Param('eventSlug') eventSlug: string) {
    const doc = await this.service.getOrCreate(eventSlug);
    const days: Record<string, boolean> = {};
    doc.days.forEach((value, key) => {
      days[key] = value;
    });
    return { eventSlug: doc.eventSlug, days };
  }

  /** Admin — update unlock status per day */
  @Patch(':eventSlug')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update unlock days for a feedback event (admin)' })
  async update(
    @Param('eventSlug') eventSlug: string,
    @Body('days') days: Record<string, boolean>,
  ) {
    const doc = await this.service.updateDays(eventSlug, days);
    const result: Record<string, boolean> = {};
    doc.days.forEach((value, key) => {
      result[key] = value;
    });
    return { eventSlug: doc.eventSlug, days: result };
  }

  /** Admin — delete settings for an event */
  @Delete(':eventSlug')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete unlock settings for a feedback event (admin)' })
  async remove(@Param('eventSlug') eventSlug: string) {
    await this.service.remove(eventSlug);
    return { message: 'Deleted successfully' };
  }
}
