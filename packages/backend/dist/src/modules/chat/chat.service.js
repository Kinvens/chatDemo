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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const chat_schema_1 = require("../drizzle/schema/chat.schema");
const drizzle_orm_1 = require("drizzle-orm");
let ChatService = class ChatService {
    db;
    constructor(db) {
        this.db = db;
    }
    async create(userId, userQuestion) {
        const [chat] = await this.db.insert(chat_schema_1.chats).values({
            userId,
            title: userQuestion.slice(0, 8)
        }).returning();
        return chat;
    }
    async findAllByUserId(userId) {
        const chatsByDb = await this.db.query.chats.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(chat_schema_1.chats.userId, userId), (0, drizzle_orm_1.eq)(chat_schema_1.chats.isDeleted, false)),
            orderBy: (0, drizzle_orm_1.desc)(chat_schema_1.chats.createdAt)
        });
        return chatsByDb;
    }
    async delete(userId, chatId) {
        const chat = await this.db.query.chats.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(chat_schema_1.chats.id, chatId), (0, drizzle_orm_1.eq)(chat_schema_1.chats.userId, userId))
        });
        if (!chat) {
            throw new common_1.BadRequestException({
                message: `Not found chat!`,
            });
        }
        await this.db.update(chat_schema_1.chats).set({
            isDeleted: true
        }).catch(e => {
            throw new common_1.BadRequestException({
                message: 'chat deleted error',
                error: e.error,
            });
        });
        return 'success';
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.Drizzle)),
    __metadata("design:paramtypes", [Object])
], ChatService);
//# sourceMappingURL=chat.service.js.map