import { ChatService } from './chat.service';
import { type Request } from 'express';
import { User } from "@schema/user.schema";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    findAll(req: Request & {
        user: User;
    }): Promise<{
        id: number;
        title: string;
        userId: string;
        isDeleted: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
