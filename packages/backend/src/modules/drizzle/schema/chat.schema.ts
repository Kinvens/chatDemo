import {pgTable, serial, text, timestamp, varchar, boolean} from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';
import {users} from "./user.schema"

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    title: varchar('title',{
        length: 20
    }).notNull(),
    userId: varchar('user_id', {
        length: 24
    }).notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatsRelations = relations(chats, ({ one }) => ({
    user: one(users, { fields: [chats.userId], references: [users.id] }),
}));

export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;