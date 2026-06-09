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
import { InnovationService } from './innovation.service';
import { CreateInnovationPhase2Dto } from './dto/create-innovation-phase2.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Innovation Challenge Phase 2')
@Controller('innovation-challenges-phase2')
export class InnovationController {
  constructor(private readonly service: InnovationService) {}

  @Post()
  @ApiOperation({ summary: 'Submit Phase 2 materials (Public)' })
  create(@Body() dto: CreateInnovationPhase2Dto) {
    return this.service.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: 'List Phase 2 submissions (Admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(+page, +limit, search);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a Phase 2 submission by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Phase 2 submission by ID (Admin only)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

@ApiTags('Innovation Challenge Applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('innovation-challenges')
export class InnovationChallengeController {
  constructor(private readonly service: InnovationService) {}

  @Get()
  @ApiOperation({ summary: 'List innovation challenge applications (Admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAllChallengeApplications(+page, +limit, search, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a challenge application by ID (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.service.findOneChallengeApplication(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update challenge application status (Admin only)' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.service.updateChallengeApplicationStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a challenge application by ID (Admin only)' })
  remove(@Param('id') id: string) {
    return this.service.removeChallengeApplication(id);
  }
}
