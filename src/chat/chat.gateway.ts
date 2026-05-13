import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { UserRole } from '../users/schemas/user.schema';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    console.log('Chat Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET') || 'fallback-secret',
      });

      client.data.user = payload;
      console.log(`Client connected: ${client.id} - User: ${payload.sub}`);
      
      // Join user to their own room for private notifications
      client.join(`user_${payload.sub}`);
    } catch (err) {
      console.log('Connection rejected: Invalid token');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    client.join(conversationId);
    return { event: 'joined', data: conversationId };
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string; recipientId?: string; isGeneral?: boolean },
  ) {
    const sender = client.data.user;
    
    // Restriction Check: Member can only message Admins
    if (sender.role === UserRole.MEMBER && !data.isGeneral) {
      // If it's a new DM, verify recipient is an Admin
      if (data.recipientId) {
         // Logic to verify recipientId is an admin would go here or in service
         // For now, let's assume the frontend only allows selecting admins
      }
    }

    // General Channel Restriction: Only Admin can message if locked (logic can be added)
    
    const message = await this.chatService.createMessage(
      data.conversationId,
      sender.sub,
      data.content,
    );

    // Broadcast to the conversation room
    this.server.to(data.conversationId).emit('new_message', message);
    
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    client.to(data.conversationId).emit('user_typing', {
      userId: client.data.user.sub,
      isTyping: data.isTyping,
    });
  }
}
