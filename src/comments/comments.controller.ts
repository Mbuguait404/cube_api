import {
  Controller,
  Get,
  Post,
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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { CommentTargetType } from './schemas/comment.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a comment on a task or daily report' })
  create(@Body() dto: CreateCommentDto, @CurrentUser() user: any) {
    return this.commentsService.create(dto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'Get comments for a task or report' })
  @ApiQuery({ name: 'targetType', enum: CommentTargetType })
  @ApiQuery({ name: 'targetId' })
  findByTarget(
    @Query('targetType') targetType: CommentTargetType,
    @Query('targetId') targetId: string,
  ) {
    return this.commentsService.findByTarget(targetType, targetId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment (own or admin)' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    const isAdmin = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role);
    return this.commentsService.delete(id, user._id.toString(), isAdmin);
  }
}
