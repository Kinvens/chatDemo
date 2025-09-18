import { ChatHistoryService } from './chatHistory.service';
import type { Request } from "express";
import { User } from "@schema/user.schema";
import { FindAllChatHistoryDto } from "./dto/find-all-chat-history.dto";
export declare class ChatHistoryController {
    private readonly chatHistoryService;
    constructor(chatHistoryService: ChatHistoryService);
    findAll(req: Request & {
        user: User;
    }, findAllChatHistoryDto: FindAllChatHistoryDto): Promise<{
        id: number;
        userId: string | null;
        isDeleted: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        content: string | null;
        role: string;
        chatId: number | null;
    }[]>;
}
