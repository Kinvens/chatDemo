"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHistoriesRelations = exports.chatHistories = exports.ChatHistoryRole = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const user_schema_1 = require("./user.schema");
var ChatHistoryRole;
(function (ChatHistoryRole) {
    ChatHistoryRole["HUMAN"] = "human";
    ChatHistoryRole["AI"] = "ai";
})(ChatHistoryRole || (exports.ChatHistoryRole = ChatHistoryRole = {}));
const chatHistoryRole = (0, pg_core_1.pgEnum)('chat_history_role', Object.values(ChatHistoryRole));
exports.chatHistories = (0, pg_core_1.pgTable)('chat_history', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    content: (0, pg_core_1.text)('content'),
    role: chatHistoryRole().notNull(),
    userId: (0, pg_core_1.varchar)('user_id', {
        length: 24
    }),
    chatId: (0, pg_core_1.integer)('chat_id'),
    isDeleted: (0, pg_core_1.boolean)("is_deleted").default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.chatHistoriesRelations = (0, drizzle_orm_1.relations)(exports.chatHistories, ({ one }) => ({
    user: one(user_schema_1.users, { fields: [exports.chatHistories.userId], references: [user_schema_1.users.id] }),
}));
//# sourceMappingURL=chatHistory.schema.js.map