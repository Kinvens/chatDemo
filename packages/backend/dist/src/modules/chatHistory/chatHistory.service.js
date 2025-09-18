"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistoryService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const drizzle_orm_1 = require("drizzle-orm");
const chatHistory_schema_1 = require("../drizzle/schema/chatHistory.schema");
let ChatHistoryService = class ChatHistoryService {
    db;
    constructor(db) {
        this.db = db;
    }
    async create(createChatHistoryDto) {
        const { userId, content, role, chatId } = createChatHistoryDto;
        const res = await this.db.insert(chatHistory_schema_1.chatHistories).values({
            content,
            chatId,
            userId,
            role
        });
        return res;
    }
    async findAll({ userId, chatId, count, orderBy = 'desc' }) {
        const qasByDb = await this.db.query.chatHistories.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(chatHistory_schema_1.chatHistories.userId, userId), (0, drizzle_orm_1.eq)(chatHistory_schema_1.chatHistories.chatId, chatId)),
            limit: count,
            orderBy: orderBy === 'desc' ? (0, drizzle_orm_1.desc)(chatHistory_schema_1.chatHistories.createdAt) : (0, drizzle_orm_1.asc)(chatHistory_schema_1.chatHistories.createdAt)
        });
        return qasByDb;
    }
};
exports.ChatHistoryService = ChatHistoryService;
exports.ChatHistoryService = ChatHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.Drizzle)),
    __metadata("design:paramtypes", [Object])
], ChatHistoryService);
//# sourceMappingURL=chatHistory.service.js.map