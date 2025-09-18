import {boolean, pgTable, timestamp, varchar} from 'drizzle-orm/pg-core';
import {createId} from "@paralleldrive/cuid2";
import {relations} from 'drizzle-orm';
import {chats} from "./chat.schema";
import {chatHistories} from "@schema/chatHistory.schema";

export const users = pgTable('user', {
    id: varchar("id", {length: 24})
        .primaryKey()
        .$defaultFn(() => createId()),
    account: varchar('name', {
        length: 25
    }).notNull(),
    password: varchar('password', {
        length: 20
    }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({many}) => ({
    chats: many(chats),
    qas: many(chatHistories),
}));
export type User= typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;