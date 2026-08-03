import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CirisService } from './ciris.service';
import { CreateCirisApplicationDto } from './dto/create-ciris-application.dto';
import { CreateCirisAttendeeDto } from './dto/create-ciris-attendee.dto';
import { UpdateCirisApplicationStatusDto } from './dto/update-ciris-application-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('CIRIS Tech 2026')
@Controller('ciris')
export class CirisController {
  constructor(private readonly service: CirisService) {}

  @Post('applications')
  @ApiOperation({ summary: 'Submit a CIRIS Tech 2026 application (Public)' })
  create(@Body() dto: CreateCirisApplicationDto) {
    return this.service.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('applications')
  @ApiOperation({ summary: 'List CIRIS applications (Admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'track', required: false })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('track') track?: string,
  ) {
    return this.service.findAll(+page, +limit, search, status, track);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('applications/stats')
  @ApiOperation({ summary: 'Get CIRIS application statistics (Admin only)' })
  stats() {
    return this.service.getStats();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('applications/:id')
  @ApiOperation({ summary: 'Get a CIRIS application by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Patch('applications/:id/status')
  @ApiOperation({ summary: 'Update CIRIS application status (Admin only)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCirisApplicationStatusDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete('applications/:id')
  @ApiOperation({ summary: 'Delete a CIRIS application (Admin only)' })
  removeApplication(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ─── Attendees ────────────────────────────────────────────────────────────

  @Post('attendees')
  @ApiOperation({ summary: 'Register as a CIRIS attendee (Public)' })
  createAttendee(@Body() dto: CreateCirisAttendeeDto) {
    return this.service.createAttendee(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('attendees')
  @ApiOperation({ summary: 'List CIRIS attendees (Admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllAttendees(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ) {
    return this.service.findAllAttendees(+page, +limit, search);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('attendees/stats')
  @ApiOperation({ summary: 'Get CIRIS attendee statistics (Admin only)' })
  attendeeStats() {
    return this.service.getAttendeeStats();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete('attendees/:id')
  @ApiOperation({ summary: 'Delete a CIRIS attendee (Admin only)' })
  removeAttendee(@Param('id') id: string) {
    return this.service.removeAttendee(id);
  }
}
