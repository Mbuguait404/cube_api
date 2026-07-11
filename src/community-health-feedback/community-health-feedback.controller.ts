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
import { CommunityHealthFeedbackService } from './community-health-feedback.service';
import { CreateCommunityHealthFeedbackDto } from './dto/create-community-health-feedback.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('community-health-feedback')
@Controller('community-health-feedback')
export class CommunityHealthFeedbackController {
  constructor(private readonly feedbackService: CommunityHealthFeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new Community Health feedback (Public)' })
  create(@Body() createDto: CreateCommunityHealthFeedbackDto) {
    return this.feedbackService.create(createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Community Health feedback submissions (Admin only)' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Community Health feedback submission (Admin only)' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
