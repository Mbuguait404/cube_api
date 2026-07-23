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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all SME Loop feedback submissions (Admin only)' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a SME Loop feedback submission (Admin only)' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
