import { type DrizzleDB } from "../drizzle/drizzle.module";
export declare class ChatService {
    private readonly db;
    constructor(db: DrizzleDB);
    create(userId: string, userQuestion: string): Promise<{
        id: number;
        title: string;
        userId: string;
        isDeleted: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllByUserId(userId: string): Promise<{
        id: number;
        title: string;
        userId: string;
        isDeleted: boolean | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    delete(userId: string, chatId: number): Promise<string>;
}
