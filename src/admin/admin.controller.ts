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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, UserStatus } from '../users/schemas/user.schema';
import {
  BulkEmailDto,
  CreateMemberDto,
  ListUsersQueryDto,
  AssignCommunityDto,
} from './dto/admin.dto';
import { CreateBadgeDto } from '../badges/dto/create-badge.dto';
import { CreateCommunityDto } from '../communities/dto/create-community.dto';
import { CreateAnnouncementDto } from '../announcements/dto/create-announcement.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  getStats() {
    return this.adminService.getDashboardStats();
  }

  // ─── User Management ──────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all members & applicants with filters' })
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.adminService.listUsers(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get a single user' })
  getUser(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Post('users')
  @ApiOperation({ summary: 'Manually create a member account' })
  createMember(@Body() dto: CreateMemberDto) {
    return this.adminService.createMember(dto);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (approve, deactivate, or reactivate)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: UserStatus,
  ) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Patch('users/:id/role')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Change user role (SuperAdmin only)' })
  updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.adminService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // ─── Community Assignment ─────────────────────────────────────────────────

  @Post('users/:id/communities')
  @ApiOperation({ summary: 'Assign user to a community' })
  assignCommunity(
    @Param('id') userId: string,
    @Body() dto: AssignCommunityDto,
  ) {
    return this.adminService.assignUserToCommunity(userId, dto.communityId);
  }

  @Delete('users/:id/communities/:communityId')
  @ApiOperation({ summary: 'Remove user from a community' })
  removeCommunity(
    @Param('id') userId: string,
    @Param('communityId') communityId: string,
  ) {
    return this.adminService.removeUserFromCommunity(userId, communityId);
  }

  // ─── Badges ───────────────────────────────────────────────────────────────

  @Get('badges')
  @ApiOperation({ summary: 'List all badges' })
  listBadges() {
    return this.adminService.listBadges();
  }

  @Post('badges')
  @ApiOperation({ summary: 'Create a new badge' })
  createBadge(@Body() dto: CreateBadgeDto) {
    return this.adminService.createBadge(dto);
  }

  @Post('users/:id/badges')
  @ApiOperation({ summary: 'Assign a badge to a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  assignBadge(
    @Param('id') userId: string,
    @Body('badgeId') badgeId: string,
  ) {
    return this.adminService.assignBadgeToUser(userId, badgeId);
  }

  @Delete('badges/:id')
  @ApiOperation({ summary: 'Delete a badge' })
  deleteBadge(@Param('id') id: string) {
    return this.adminService.deleteBadge(id);
  }

  // ─── Communities ──────────────────────────────────────────────────────────

  @Get('communities')
  @ApiOperation({ summary: 'List all communities' })
  listCommunities() {
    return this.adminService.listCommunities();
  }

  @Post('communities')
  @ApiOperation({ summary: 'Create a new community group' })
  createCommunity(@Body() dto: CreateCommunityDto) {
    return this.adminService.createCommunity(dto);
  }

  // ─── Announcements ────────────────────────────────────────────────────────

  @Get('announcements')
  @ApiOperation({ summary: 'List all announcements' })
  listAnnouncements() {
    return this.adminService.listAnnouncements();
  }

  @Post('announcements')
  @ApiOperation({
    summary: 'Create a targeted announcement (empty communities = broadcast)',
  })
  createAnnouncement(
    @Body() dto: CreateAnnouncementDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.createAnnouncement(dto, user._id.toString());
  }

  @Delete('announcements/:id')
  @ApiOperation({ summary: 'Delete an announcement' })
  deleteAnnouncement(@Param('id') id: string) {
    return this.adminService.deleteAnnouncement(id);
  }

  @Patch('announcements/:id/toggle')
  @ApiOperation({ summary: 'Toggle announcement active status' })
  toggleAnnouncement(@Param('id') id: string) {
    return this.adminService.toggleAnnouncement(id);
  }

  // ─── Bulk Email via Uniflow ───────────────────────────────────────────────

  @Post('communications/bulk-email')
  @ApiOperation({
    summary:
      'Send bulk email to a community via Uniflow (use communityId="all" for everyone)',
  })
  sendBulkEmail(@Body() dto: BulkEmailDto) {
    return this.adminService.sendBulkEmail(dto);
  }

  // ─── CMS / CMC Application Sync ──────────────────────────────────────────

  @Get('cms/applications')
  @ApiOperation({ summary: 'Pull applications from CMC' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  getCmsApplications(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getCmsApplications(+page, +limit, search, status);
  }

  @Get('cms/memberships')
  @ApiOperation({ summary: 'Pull membership submissions from CMC' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  getCmsMemberships(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getCmsMemberships(+page, +limit, search, status);
  }

  @Get('cms/applications/:id')
  @ApiOperation({ summary: 'Get a specific CMC application by ID' })
  getCmsApplication(@Param('id') id: string) {
    return this.adminService.getCmsApplicationById(id);
  }

  @Post('cms/applications/:id/import')
  @ApiOperation({ summary: 'Import a CMS application into the Hub as a member' })
  importCmsApplication(@Param('id') id: string) {
    return this.adminService.importCmsApplication(id);
  }

  @Post('cms/memberships/:id/import')
  @ApiOperation({ summary: 'Import a CMS membership into the Hub as a member' })
  importCmsMembership(@Param('id') id: string) {
    return this.adminService.importCmsMembership(id);
  }
}
