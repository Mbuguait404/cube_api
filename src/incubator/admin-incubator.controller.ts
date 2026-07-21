import {
  Controller,
  Get,
  Post,
  Patch,
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
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { IncubatorService } from './incubator.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { UpdateIncubatorApplicationStatusDto } from './dto/update-incubator-application.dto';
import { CreateIncubatorCohortDto } from './dto/create-incubator-cohort.dto';
import { UpdateIncubatorCohortDto, EnrollMembersDto } from './dto/update-incubator-cohort.dto';

@ApiTags('Admin / Incubator')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/incubator')
export class AdminIncubatorController {
  constructor(private incubatorService: IncubatorService) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: 'Get incubator dashboard stats' })
  getDashboardStats() {
    return this.incubatorService.getDashboardStats();
  }

  // ─── Applications ─────────────────────────────────────────────────────────

  @Get('applications')
  @ApiOperation({ summary: 'List incubator applications with filters' })
  @ApiQuery({ name: 'type', required: false, enum: ['founder', 'partner', 'mentor'] })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'reviewed', 'accepted', 'rejected'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'cohort', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  listApplications(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('cohort') cohort?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.incubatorService.listApplications({ type, status, search, cohort, page: +page, limit: +limit });
  }

  @Get('applications/:id')
  @ApiOperation({ summary: 'Get a single incubator application' })
  getApplication(@Param('id') id: string) {
    return this.incubatorService.getApplicationById(id);
  }

  @Patch('applications/:id/status')
  @ApiOperation({ summary: 'Update application status, notes, or cohort assignment' })
  updateApplicationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateIncubatorApplicationStatusDto,
    @CurrentUser() admin: any,
  ) {
    const adminId = admin._id ? admin._id.toString() : admin.sub;
    return this.incubatorService.updateApplicationStatus(id, dto, adminId);
  }

  @Delete('applications/:id')
  @ApiOperation({ summary: 'Delete an incubator application' })
  deleteApplication(@Param('id') id: string) {
    return this.incubatorService.deleteApplication(id);
  }

  @Post('applications/:id/import')
  @ApiOperation({ summary: 'Import an application as a community member' })
  importApplication(
    @Param('id') id: string,
    @CurrentUser() admin: any,
  ) {
    const adminId = admin._id ? admin._id.toString() : admin.sub;
    return this.incubatorService.importApplicationAsMember(id, adminId);
  }

  // ─── Cohorts ──────────────────────────────────────────────────────────────

  @Get('cohorts')
  @ApiOperation({ summary: 'List all incubator cohorts' })
  listCohorts() {
    return this.incubatorService.listCohorts();
  }

  @Post('cohorts')
  @ApiOperation({ summary: 'Create a new incubator cohort' })
  createCohort(
    @Body() dto: CreateIncubatorCohortDto,
    @CurrentUser() admin: any,
  ) {
    const adminId = admin._id ? admin._id.toString() : admin.sub;
    return this.incubatorService.createCohort(dto, adminId);
  }

  @Get('cohorts/:id')
  @ApiOperation({ summary: 'Get a cohort with enrolled members' })
  getCohort(@Param('id') id: string) {
    return this.incubatorService.getCohortById(id);
  }

  @Patch('cohorts/:id')
  @ApiOperation({ summary: 'Update cohort details' })
  updateCohort(
    @Param('id') id: string,
    @Body() dto: UpdateIncubatorCohortDto,
  ) {
    return this.incubatorService.updateCohort(id, dto);
  }

  @Delete('cohorts/:id')
  @ApiOperation({ summary: 'Delete a cohort' })
  deleteCohort(@Param('id') id: string) {
    return this.incubatorService.deleteCohort(id);
  }

  @Post('cohorts/:id/enroll')
  @ApiOperation({ summary: 'Enroll members into a cohort' })
  enrollMembers(
    @Param('id') id: string,
    @Body() dto: EnrollMembersDto,
  ) {
    return this.incubatorService.enrollMembers(id, dto.memberIds || []);
  }

  @Delete('cohorts/:id/members/:userId')
  @ApiOperation({ summary: 'Remove a member from a cohort' })
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.incubatorService.removeMember(id, userId);
  }
}
