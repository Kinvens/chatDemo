"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRelations = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const cuid2_1 = require("@paralleldrive/cuid2");
const drizzle_orm_1 = require("drizzle-orm");
const chat_schema_1 = require("./chat.schema");
const chatHistory_schema_1 = require("./chatHistory.schema");
exports.users = (0, pg_core_1.pgTable)('user', {
    id: (0, pg_core_1.varchar)("id", { length: 24 })
        .primaryKey()
        .$defaultFn(() => (0, cuid2_1.createId)()),
    account: (0, pg_core_1.varchar)('name', {
        length: 25
    }).notNull(),
    password: (0, pg_core_1.varchar)('password', {
        length: 20
    }).notNull(),
    isDeleted: (0, pg_core_1.boolean)("is_deleted").default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    chats: many(chat_schema_1.chats),
    qas: many(chatHistory_schema_1.chatHistories),
}));
//# sourceMappingURL=user.schema.js.map