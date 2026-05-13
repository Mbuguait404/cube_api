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
import { ProjectsService } from './projects.service';
import { TasksService } from '../tasks/tasks.service';
import { DailyReportsService } from '../daily-reports/daily-reports.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  AddProjectMembersDto,
} from './dto/project.dto';
import { CreateTaskDto } from '../tasks/dto/task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';

// ─── Admin Controller ─────────────────────────────────────────────────────

@ApiTags('Admin / Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/projects')
export class AdminProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
    private readonly reportsService: DailyReportsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create(dto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'List all projects (filterable)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'programId', required: false })
  @ApiQuery({ name: 'memberId', required: false })
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('programId') programId?: string,
    @Query('memberId') memberId?: string,
  ) {
    return this.projectsService.findAll({ status, priority, programId, memberId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full project detail' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add members to a project' })
  @ApiParam({ name: 'id' })
  addMembers(@Param('id') id: string, @Body() dto: AddProjectMembersDto) {
    return this.projectsService.addMembers(id, dto);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a member from a project' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'userId' })
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.projectsService.removeMember(id, userId);
  }

  // ── Inline Task creation for a project ──────────────────────────────

  @Post(':id/tasks')
  @ApiOperation({ summary: 'Create a task in this project' })
  @ApiParam({ name: 'id' })
  createTask(
    @Param('id') projectId: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.create(projectId, dto, user._id.toString());
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get all tasks in a project' })
  @ApiParam({ name: 'id' })
  getProjectTasks(@Param('id') projectId: string) {
    return this.tasksService.findByProject(projectId);
  }

  @Get(':id/tasks/stats')
  @ApiOperation({ summary: 'Get task status counts for a project' })
  @ApiParam({ name: 'id' })
  getTaskStats(@Param('id') projectId: string) {
    return this.tasksService.getProjectTaskStats(projectId);
  }

  // ── Reports for a project ───────────────────────────────────────────

  @Get(':id/daily-reports')
  @ApiOperation({ summary: 'Get all daily reports for a project' })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'authorId', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  getProjectReports(
    @Param('id') projectId: string,
    @Query('authorId') authorId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.findAll({ projectId, authorId, from, to });
  }
}

// ─── Member Controller ─────────────────────────────────────────────────────

@ApiTags('Member / Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('member/projects')
export class MemberProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
    private readonly reportsService: DailyReportsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get my assigned projects' })
  getMyProjects(@CurrentUser() user: any) {
    return this.projectsService.findByMember(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project I am a member of' })
  @ApiParam({ name: 'id' })
  getProjectDetail(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.findByIdForMember(id, user._id.toString());
  }

  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get all tasks in a project' })
  @ApiParam({ name: 'id' })
  async getProjectTasks(@Param('id') projectId: string, @CurrentUser() user: any) {
    // Verify membership
    await this.projectsService.findByIdForMember(projectId, user._id.toString());
    return this.tasksService.findByProject(projectId);
  }

  @Get(':id/daily-reports')
  @ApiOperation({ summary: 'Get all daily reports for a project' })
  @ApiParam({ name: 'id' })
  async getProjectReports(@Param('id') projectId: string, @CurrentUser() user: any) {
    // Verify membership
    await this.projectsService.findByIdForMember(projectId, user._id.toString());
    return this.reportsService.findAll({ projectId });
  }
}
