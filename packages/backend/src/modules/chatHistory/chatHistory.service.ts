import {Inject, Injectable} from '@nestjs/common';
import {Drizzle, type DrizzleDB} from "../drizzle/drizzle.module";
import {and, asc, desc, eq} from "drizzle-orm";
import {chatHistories, ChatHistoryRole} from "@schema/chatHistory.schema";

@Injectable()
export class ChatHistoryService {
    constructor(@Inject(Drizzle) private readonly db: DrizzleDB) {
    }

    async create(createChatHistoryDto: {
        userId: string,
        content: string,
        chatId: number,
        role: ChatHistoryRole
    }) {
        const {userId, content, role, chatId} = createChatHistoryDto
        const res = await this.db.insert(chatHistories).values({
            content,
            chatId,
            userId,
            role
        })
        return res
    }

    async findAll({userId, chatId, count, orderBy = 'desc'}: {
        userId: string,
        chatId: number,
        count?: number,
        orderBy?: 'desc' | 'asc'
    }) {
        const qasByDb = await this.db.query.chatHistories.findMany({
            where: and(
                eq(
                    chatHistories.userId, userId
                ),
                eq(
                    chatHistories.chatId, chatId
                ),
            ),
            limit: count,
            orderBy: orderBy === 'desc' ? desc(chatHistories.createdAt) : asc(chatHistories.createdAt)
        })
        return qasByDb
    }
}
