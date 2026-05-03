import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Communities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
}
