import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Admin Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin/logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiOperation({ summary: 'List all request logs' })
  findAll(
    @Query() query: any,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    return this.logsService.findAll(query, {
      limit: limit ? +limit : 50,
      skip: skip ? +skip : 0,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific log entry' })
  async findOne(@Param('id') id: string) {
    const log = await this.logsService.findOne(id);
    if (!log) {
      throw new NotFoundException(`Log with ID ${id} not found`);
    }
    return log;
  }

  @Delete('clear')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Clear all logs (SuperAdmin only)' })
  clearLogs() {
    return this.logsService.clearLogs();
  }
}
