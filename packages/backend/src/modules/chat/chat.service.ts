import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {users} from "@schema/user.schema";
import {Drizzle, type DrizzleDB} from "../drizzle/drizzle.module";
import {chats} from "@schema/chat.schema";
import {and, desc, eq} from "drizzle-orm";

@Injectable()
export class ChatService {
    constructor(@Inject(Drizzle) private readonly db: DrizzleDB) {
    }

    // 创建ai聊天会话
    async create(userId: string, userQuestion: string) {
        const [chat] = await this.db.insert(chats).values({
            userId,
            title: userQuestion.slice(0, 8)
        }).returning()
        return chat
    }

    async findAllByUserId(userId: string) {
        const chatsByDb = await this.db.query.chats.findMany({
            where: and(
                eq(
                    chats.userId, userId
                ),
                eq(
                    chats.isDeleted, false
                )
            ),
            orderBy:desc(chats.createdAt)
        })
        return chatsByDb
    }

    async delete(userId: string, chatId: number) {
        const chat = await this.db.query.chats.findFirst({
            where: and(
                eq(
                    chats.id, chatId
                ),
                eq(
                    chats.userId, userId
                )
            )
        })
        if (!chat) {
            throw new BadRequestException({
                    message: `Not found chat!`,
                }
            )
        }

        await this.db.update(chats).set({
            isDeleted: true
        }).catch(e => {
            throw new BadRequestException({
                message: 'chat deleted error',
                error: e.error,
            })
        })
        return 'success'
    }
}
