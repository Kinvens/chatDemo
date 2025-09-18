"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatsRelations = exports.chats = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const user_schema_1 = require("./user.schema");
exports.chats = (0, pg_core_1.pgTable)('chats', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', {
        length: 20
    }).notNull(),
    userId: (0, pg_core_1.varchar)('user_id', {
        length: 24
    }).notNull(),
    isDeleted: (0, pg_core_1.boolean)("is_deleted").default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.chatsRelations = (0, drizzle_orm_1.relations)(exports.chats, ({ one }) => ({
    user: one(user_schema_1.users, { fields: [exports.chats.userId], references: [user_schema_1.users.id] }),
}));
//# sourceMappingURL=chat.schema.js.map