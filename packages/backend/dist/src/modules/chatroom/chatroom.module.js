"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatroomModule = void 0;
const common_1 = require("@nestjs/common");
const chatroom_service_1 = require("./chatroom.service");
const chatroom_gateway_1 = require("./chatroom.gateway");
const user_module_1 = require("../user/user.module");
const chat_module_1 = require("../chat/chat.module");
const chatHistory_module_1 = require("../chatHistory/chatHistory.module");
let ChatroomModule = class ChatroomModule {
};
exports.ChatroomModule = ChatroomModule;
exports.ChatroomModule = ChatroomModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, chat_module_1.ChatModule, chatHistory_module_1.ChatHistoryModule],
        providers: [chatroom_gateway_1.ChatroomGateway, chatroom_service_1.ChatroomService],
    })
], ChatroomModule);
//# sourceMappingURL=chatroom.module.js.map