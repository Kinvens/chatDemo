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
exports.ChatroomGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chatroom_service_1 = require("./chatroom.service");
const common_1 = require("@nestjs/common");
const wsAuth_guard_1 = require("../../guards/wsAuth.guard");
const ws_exception_filter_1 = require("../../filters/ws-exception.filter");
const chat_service_1 = require("../chat/chat.service");
const chatHistory_service_1 = require("../chatHistory/chatHistory.service");
const chatHistory_schema_1 = require("../drizzle/schema/chatHistory.schema");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
let ChatroomGateway = class ChatroomGateway {
    chatroomService;
    chatService;
    chatHistoryService;
    jwtService;
    userService;
    connections = new Map();
    constructor(chatroomService, chatService, chatHistoryService, jwtService, userService) {
        this.chatroomService = chatroomService;
        this.chatService = chatService;
        this.chatHistoryService = chatHistoryService;
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async handleConnection(client) {
        const token = client.handshake.auth.token;
        if (!token) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        try {
            const payload = this.jwtService.verify(token);
            const { userId } = payload;
            const user = await this.userService.findOneByUserId(userId);
            if (!user) {
                throw new common_1.UnauthorizedException('Unauthorized');
            }
            client.user = user;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        const userId = client.user.id;
        const chatId = client.handshake.query.chatId;
        console.log('Client connected', userId, chatId);
        if (userId && chatId) {
            const id = `${userId}:${chatId}`;
            if (!this.connections.has(id)) {
                const ctx = await this.chatroomService.createContext(userId, chatId);
                this.connections.set(ctx.id, ctx);
            }
        }
        client.emit('connection_ack', { connectionId: client.id });
    }
    async handleDisconnect(client) {
        const id = client.id;
        const ctx = this.connections.get(id);
        if (ctx) {
            this.connections.delete(id);
        }
    }
    async onChatMessage(payload, client) {
        const _this = this;
        const { text } = payload;
        let { chatId } = payload;
        const id = client.id;
        const userId = client.user.id;
        let chat = null;
        if (!chatId) {
            chat = await this.chatService.create(userId, text);
            chatId = chat.id;
        }
        let ctx = this.connections.get(id);
        if (!ctx) {
            ctx = await this.chatroomService.createContext(userId, chatId);
            this.connections.set(ctx.id, ctx);
        }
        const { chain, history } = ctx;
        await this.chatHistoryService.create({
            userId,
            content: text,
            chatId,
            role: chatHistory_schema_1.ChatHistoryRole.HUMAN
        });
        chain.call({
            human: text
        }, {
            callbacks: [
                {
                    handleLLMNewToken(token) {
                        process.stdout.write(token);
                        console.log(token, '------');
                        client.emit('chat_message_token', token);
                    },
                    handleLLMEnd(output) {
                        const text = output.generations[0][0].text;
                        console.log("\n生成完成:", text);
                        client.emit('chat_message_end', text);
                        _this.chatHistoryService.create({
                            userId,
                            content: text,
                            chatId,
                            role: chatHistory_schema_1.ChatHistoryRole.AI
                        });
                    },
                    handleLLMError(err) {
                        client.emit('chat_message_error', err);
                        console.error("LLM 出错:", err);
                    },
                },
            ]
        });
        return { connectionId: id, chat };
    }
};
exports.ChatroomGateway = ChatroomGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('chat_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatroomGateway.prototype, "onChatMessage", null);
exports.ChatroomGateway = ChatroomGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, {
        namespace: 'chatroom',
        cors: true
    }),
    (0, common_1.UseGuards)(wsAuth_guard_1.WsAuthGuard),
    (0, common_1.UseFilters)(ws_exception_filter_1.WsExceptionsFilter),
    __metadata("design:paramtypes", [chatroom_service_1.ChatroomService,
        chat_service_1.ChatService,
        chatHistory_service_1.ChatHistoryService,
        jwt_1.JwtService,
        user_service_1.UserService])
], ChatroomGateway);
//# sourceMappingURL=chatroom.gateway.js.map