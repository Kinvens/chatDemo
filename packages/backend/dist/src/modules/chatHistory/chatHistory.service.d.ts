import { type DrizzleDB } from "../drizzle/drizzle.module";
import { ChatHistoryRole } from "@schema/chatHistory.schema";
export declare class ChatHistoryService {
    private readonly db;
    constructor(db: DrizzleDB);
    create(createChatHistoryDto: {
        userId: string;
        content: string;
        chatId: number;
        role: ChatHistoryRole;
    }): Promise<import("pg").QueryResult<never>>;
    findAll({ userId, chatId, count, orderBy }: {
        userId: string;
        chatId: number;
        count?: number;
        orderBy?: 'desc' | 'asc';
    }): Promise<{
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
