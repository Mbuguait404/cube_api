import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AnnouncementsService } from '../announcements/announcements.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private announcementsService: AnnouncementsService,
  ) {}

  @Get('profile/me')
  @ApiOperation({ summary: 'Get own profile (includes profile completion %)' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getMyProfile(user._id.toString());
  }

  @Patch('profile/me')
  @ApiOperation({ summary: 'Update own profile' })
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user._id.toString(), dto);
  }

  @Get('me/events')
  @ApiOperation({ summary: 'Get events attended (synced from CMS)' })
  getEvents(@CurrentUser() user: any) {
    return this.usersService.getMyEvents(user._id.toString());
  }

  @Get('me/badges')
  @ApiOperation({ summary: 'Get assigned badges' })
  getBadges(@CurrentUser() user: any) {
    return this.usersService.getMyBadges(user._id.toString());
  }

  @Get('me/channels')
  @ApiOperation({
    summary: 'Get dashboard channels / announcements for this user',
  })
  async getChannels(@CurrentUser() user: any) {
    const communityIds = await this.usersService.getMyCommunityIds(
      user._id.toString(),
    );
    return this.announcementsService.getForCommunities(communityIds);
  }
}
