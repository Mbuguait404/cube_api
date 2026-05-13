import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { CreateCommunityDto } from './dto/create-community.dto';

@ApiTags('Communities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List all community groups' })
  findAll() {
    return this.communitiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get community details by ID' })
  findOne(@Param('id') id: string) {
    return this.communitiesService.findById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new community group' })
  create(@Body() dto: CreateCommunityDto) {
    return this.communitiesService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update community details' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCommunityDto>) {
    return this.communitiesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a community' })
  remove(@Param('id') id: string) {
    return this.communitiesService.delete(id);
  }
}

