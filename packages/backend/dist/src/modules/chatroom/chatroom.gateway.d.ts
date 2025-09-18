import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatroomService } from './chatroom.service';
import { type Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { User } from "@schema/user.schema";
import { ChatHistoryService } from '../chatHistory/chatHistory.service';
import { JwtService } from "@nestjs/jwt";
import { UserService } from '../user/user.service';
export declare class ChatroomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatroomService;
    private readonly chatService;
    private readonly chatHistoryService;
    private readonly jwtService;
    private readonly userService;
    private connections;
    constructor(chatroomService: ChatroomService, chatService: ChatService, chatHistoryService: ChatHistoryService, jwtService: JwtService, userService: UserService);
    handleConnection(client: Socket & {
        user?: User;
    }): Promise<void>;
    handleDisconnect(client: Socket & {
        user: User;
    }): Promise<void>;
    onChatMessage(payload: {
        text: string;
        chatId?: number;
    }, client: Socket & {
        user: User;
    }): Promise<{
        connectionId: string;
        chat: {
            id: number;
            title: string;
            userId: string;
            isDeleted: boolean | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
}
