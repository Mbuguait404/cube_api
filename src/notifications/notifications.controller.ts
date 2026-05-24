import {
  Controller,
  Get,
  Patch,
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
import { NotificationsService } from './notifications.service';
import { UpdateNotificationPreferenceDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the logged in user' })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  getNotifications(
    @CurrentUser() user: any,
    @Query('isRead') isRead?: string,
  ) {
    const userId = user._id ? user._id.toString() : user.sub;
    const isReadBool = isRead === undefined ? undefined : isRead === 'true';
    return this.notificationsService.findAllForUser(userId, isReadBool);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser() user: any) {
    const userId = user._id ? user._id.toString() : user.sub;
    return this.notificationsService.markAllAsRead(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  @ApiParam({ name: 'id' })
  markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const userId = user._id ? user._id.toString() : user.sub;
    return this.notificationsService.markAsRead(id, userId);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preferences' })
  getPreferences(@CurrentUser() user: any) {
    const userId = user._id ? user._id.toString() : user.sub;
    return this.notificationsService.getPreferences(userId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  updatePreferences(
    @CurrentUser() user: any,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    const userId = user._id ? user._id.toString() : user.sub;
    return this.notificationsService.updatePreferences(userId, dto);
  }
}
