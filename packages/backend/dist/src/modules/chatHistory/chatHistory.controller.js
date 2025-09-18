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
exports.ChatHistoryController = void 0;
const common_1 = require("@nestjs/common");
const chatHistory_service_1 = require("./chatHistory.service");
const auth_guard_1 = require("../../guards/auth.guard");
const find_all_chat_history_dto_1 = require("./dto/find-all-chat-history.dto");
let ChatHistoryController = class ChatHistoryController {
    chatHistoryService;
    constructor(chatHistoryService) {
        this.chatHistoryService = chatHistoryService;
    }
    async findAll(req, findAllChatHistoryDto) {
        const { user } = req;
        const { chatId } = findAllChatHistoryDto;
        return this.chatHistoryService.findAll({
            userId: user.id,
            chatId: Number(chatId),
            orderBy: 'asc'
        });
    }
};
exports.ChatHistoryController = ChatHistoryController;
__decorate([
    (0, common_1.Get)('findAll'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, find_all_chat_history_dto_1.FindAllChatHistoryDto]),
    __metadata("design:returntype", Promise)
], ChatHistoryController.prototype, "findAll", null);
exports.ChatHistoryController = ChatHistoryController = __decorate([
    (0, common_1.Controller)('chatHistory'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [chatHistory_service_1.ChatHistoryService])
], ChatHistoryController);
//# sourceMappingURL=chatHistory.controller.js.map