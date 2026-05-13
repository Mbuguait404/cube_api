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
import { DailyReportsService } from './daily-reports.service';
import { CreateDailyReportDto, UpdateDailyReportDto } from './dto/daily-report.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';

// ─── Admin Daily Reports ──────────────────────────────────────────────────

@ApiTags('Admin / Daily Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/daily-reports')
export class AdminDailyReportsController {
  constructor(private readonly reportsService: DailyReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all daily reports with filters' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'authorId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  findAll(
    @Query('projectId') projectId?: string,
    @Query('authorId') authorId?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reportsService.findAll({ projectId, authorId, status, from, to });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific daily report' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a daily report' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.reportsService.delete(id);
  }
}

// ─── Member Daily Reports ─────────────────────────────────────────────────

@ApiTags('Member / Daily Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('member/daily-reports')
export class MemberDailyReportsController {
  constructor(private readonly reportsService: DailyReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a daily report (or save draft)' })
  create(@Body() dto: CreateDailyReportDto, @CurrentUser() user: any) {
    return this.reportsService.create(dto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'Get my daily report history' })
  getMyReports(@CurrentUser() user: any) {
    return this.reportsService.findByAuthor(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific report of mine' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a draft report' })
  @ApiParam({ name: 'id' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDailyReportDto,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.update(id, dto, user._id.toString());
  }
}
