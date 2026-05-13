import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@ApiTags('Announcements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get announcements for the current user' })
  async getMyAnnouncements(@CurrentUser() user: UserDocument) {
    // If user has no communities, they only see global ones
    // Extract IDs if populated, otherwise use them as is
    const communityIds = (user.communities || []).map((c: any) =>
      c._id ? c._id : c,
    );
    return this.announcementsService.getForCommunities(communityIds as any);
  }
}
