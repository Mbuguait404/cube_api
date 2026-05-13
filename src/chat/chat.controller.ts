import { Controller, Get, Post, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Get all conversations for current user' })
  @Get('conversations')
  async getConversations(@Req() req) {
    return this.chatService.getConversations(req.user._id);
  }

  @ApiOperation({ summary: 'Get messages for a conversation' })
  @Get('messages/:conversationId')
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
  ) {
    return this.chatService.getMessages(conversationId, limit, skip);
  }

  @ApiOperation({ summary: 'Find or create a DM conversation' })
  @Post('conversation')
  async createConversation(@Req() req, @Body() body: { recipientId: string }) {
    return this.chatService.findOrCreateConversation([req.user._id, body.recipientId]);
  }

  @ApiOperation({ summary: 'Get general channel' })
  @Get('general')
  async getGeneralChannel() {
    return this.chatService.findOrCreateConversation([], true);
  }

  @ApiOperation({ summary: 'Get list of admins (for members to start chat)' })
  @Get('admins')
  async getAdmins() {
    return this.chatService.getAdmins();
  }

  @ApiOperation({ summary: 'Get list of members (for admins to start chat)' })
  @Get('members')
  async getMembers() {
    return this.chatService.getMembers();
  }

  @ApiOperation({ summary: 'Lock/Unlock general channel' })
  @Post('general/lock')
  async lockGeneralChannel(@Body() body: { isLocked: boolean }) {
    return this.chatService.lockGeneralChannel(body.isLocked);
  }
}
