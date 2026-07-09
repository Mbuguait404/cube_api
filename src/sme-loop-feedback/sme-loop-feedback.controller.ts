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
import { SmeLoopFeedbackService } from './sme-loop-feedback.service';
import { CreateSmeLoopFeedbackDto } from './dto/create-sme-loop-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('sme-loop-feedback')
@Controller('sme-loop-feedback')
export class SmeLoopFeedbackController {
  constructor(private readonly feedbackService: SmeLoopFeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new SME Loop feedback (Public)' })
  create(@Body() createDto: CreateSmeLoopFeedbackDto) {
    return this.feedbackService.create(createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all SME Loop feedback submissions (Admin only)' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a SME Loop feedback submission (Admin only)' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
