import {relations} from 'drizzle-orm';
import {pgTable, serial, text, integer, timestamp, varchar, boolean, pgEnum} from 'drizzle-orm/pg-core';
import {users} from './user.schema';

export enum ChatHistoryRole {
    HUMAN = 'human',
    AI = 'ai'
}

const chatHistoryRole = pgEnum('chat_history_role', Object.values(ChatHistoryRole) as [string, ...string[]]);
export const chatHistories = pgTable('chat_history', {
    id: serial('id').primaryKey(),
    content: text('content'),
    role: chatHistoryRole().notNull(),
    userId: varchar('user_id', {
        length: 24
    }),
    chatId: integer('chat_id'),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatHistoriesRelations = relations(chatHistories, ({ one }) => ({
    user: one(users, { fields: [chatHistories.userId], references: [users.id] }),
}));


export type ChatHistory = typeof chatHistories.$inferSelect;
export type NewChatHistory = typeof chatHistories.$inferInsert;
