import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private configService;
    private chatService;
    server: Server;
    constructor(jwtService: JwtService, configService: ConfigService, chatService: ChatService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinConversation(client: Socket, conversationId: string): {
        event: string;
        data: string;
    };
    handleMessage(client: Socket, data: {
        conversationId: string;
        content: string;
        recipientId?: string;
        isGeneral?: boolean;
    }): Promise<import("mongoose").PopulateDocumentResult<import("mongoose").Document<unknown, {}, import("./schemas/message.schema").MessageDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/message.schema").Message & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./schemas/message.schema").MessageDocument, import("./schemas/message.schema").MessageDocument>>;
    handleTyping(client: Socket, data: {
        conversationId: string;
        isTyping: boolean;
    }): void;
}
