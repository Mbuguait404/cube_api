import {
  Controller,
  Get,
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
import { TasksService } from './tasks.service';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';

// ─── Admin Task Controller ────────────────────────────────────────────────

@ApiTags('Admin / Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/tasks')
export class AdminTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit any task (title, assignees, status, etc.)' })
  @ApiParam({ name: 'id' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}

// ─── Member Task Controller ───────────────────────────────────────────────

@ApiTags('Member / Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('member/tasks')
export class MemberTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks assigned to me (optionally by project)' })
  @ApiQuery({ name: 'projectId', required: false })
  getMyTasks(
    @CurrentUser() user: any,
    @Query('projectId') projectId?: string,
  ) {
    return this.tasksService.findByAssignee(user._id.toString(), projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task detail' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status of a task assigned to me' })
  @ApiParam({ name: 'id' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.updateStatusByMember(id, dto, user._id.toString());
  }
}
