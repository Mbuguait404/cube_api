import { Controller, Get, Post, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CmsBridgeService } from './cms-bridge.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/schemas/user.schema';

@ApiTags('CMS Bridge')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cms')
export class CmsBridgeController {
  constructor(private cmsService: CmsBridgeService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check connection to CMC' })
  async checkHealth() {
    try {
      // Small request to check connectivity
      await this.cmsService.getEvents({ limit: 1 });
      return { status: 'connected', message: 'Successfully reached CMC' };
    } catch (err) {
      return { status: 'error', message: `CMS connection failed: ${err.message}` };
    }
  }

  @Get('events')
  @ApiOperation({ summary: 'Fetch events from CMS' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getEvents(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.cmsService.getEvents({ page: +page, limit: +limit });
  }

  @Get('banners')
  @ApiOperation({ summary: 'Fetch carousel/banner content from CMS' })
  getBanners() {
    return this.cmsService.getBanners();
  }

  @Get('resources')
  @ApiOperation({ summary: 'Fetch downloadable resources from CMS' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getResources(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.cmsService.getResources({ page: +page, limit: +limit });
  }

  @Get('blog')
  @ApiOperation({ summary: 'Fetch blog posts from CMS' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getBlog(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.cmsService.getBlogPosts({ page: +page, limit: +limit });
  }

  @Get('applications')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Fetch applications (admissions) from CMS' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getApplications(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.cmsService.getApplications({ page: +page, limit: +limit });
  }

  @Get('memberships')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Fetch membership submissions from CMS' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getMemberships(@Query('page') page = 1, @Query('limit') limit = 50) {
    return this.cmsService.getMemberships({ page: +page, limit: +limit });
  }

  @Get('applications/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get application details by ID' })
  getApplicationById(@Param('id') id: string) {
    return this.cmsService.getApplicationById(id);
  }

  @Post('applications/:id/import')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Import a CMS application into the Hub as a member' })
  importApplication(@Param('id') id: string) {
    return this.cmsService.importApplication(id, 'admission');
  }

  @Post('memberships/:id/import')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Import a CMS membership submission into the Hub as a member' })
  importMembership(@Param('id') id: string) {
    return this.cmsService.importApplication(id, 'membership');
  }
}
