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
import { SmeLoopGrandEmpireFeedbackService } from './sme-loop-grand-empire-feedback.service';
import { CreateSmeLoopGrandEmpireFeedbackDto } from './dto/create-sme-loop-grand-empire-feedback.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('SME Loop Grand Empire Feedback')
@Controller('sme-loop-grand-empire-feedback')
export class SmeLoopGrandEmpireFeedbackController {
  constructor(private readonly service: SmeLoopGrandEmpireFeedbackService) {}

  /** Public endpoint — no auth required */
  @Post()
  @ApiOperation({ summary: 'Submit feedback for a training day (public)' })
  create(@Body() dto: CreateSmeLoopGrandEmpireFeedbackDto) {
    return this.service.create(dto);
  }

  /** Admin-only — view all submissions, optionally filtered by day */
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all feedback submissions (admin)' })
  @ApiQuery({ name: 'day', required: false, enum: ['1', '2', '3', '4'] })
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
