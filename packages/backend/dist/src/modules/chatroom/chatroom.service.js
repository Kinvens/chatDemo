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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatroomService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("@langchain/openai");
const config_1 = require("@nestjs/config");
const memory_1 = require("langchain/memory");
const chatHistory_service_1 = require("../chatHistory/chatHistory.service");
const chains_1 = require("langchain/chains");
const prompts_1 = require("@langchain/core/prompts");
let ChatroomService = class ChatroomService {
    configService;
    chatHistoryService;
    constructor(configService, chatHistoryService) {
        this.configService = configService;
        this.chatHistoryService = chatHistoryService;
    }
    async createContext(userId, chatId) {
        const id = `${userId}:${chatId}`;
        const history = await this.createLangChainHistory(userId, Number(chatId));
        const chat = new openai_1.ChatOpenAI({
            apiKey: this.configService.get('OPENAI_API_KEY'),
            model: "glm-4.5",
            temperature: 0.7,
            streaming: true,
            configuration: {
                baseURL: this.configService.get('OPENAI_BASE_URL'),
            },
        });
        const prompt = prompts_1.ChatPromptTemplate.fromPromptMessages([
            { role: "system", content: "你是一个聊天 AI。" },
            new prompts_1.MessagesPlaceholder("chat_history"),
            { role: "human", content: "{human}" },
        ]);
        const chain = new chains_1.ConversationChain({
            llm: chat,
            prompt,
            memory: history,
        });
        return {
            id,
            createdAt: new Date(),
            history,
            chain,
        };
    }
    async createLangChainHistory(userId, chatId) {
        const memory = new memory_1.BufferWindowMemory({
            humanPrefix: 'human',
            aiPrefix: 'ai',
            k: 10,
            memoryKey: "chat_history",
            returnMessages: true
        });
        const chatHistories = await this.chatHistoryService.findAll({
            userId,
            chatId: chatId,
            count: 10,
            orderBy: 'desc'
        });
        const formattedChatHistory = [];
        let tempMessage = [undefined, undefined];
        while (chatHistories.length > 0) {
            const lastChatHistory = chatHistories.pop();
            const { role } = lastChatHistory;
            if (role === 'human') {
                tempMessage[0] = lastChatHistory;
            }
            if (role === 'ai') {
                tempMessage[1] = lastChatHistory;
                formattedChatHistory.push(tempMessage);
                tempMessage = [undefined, undefined];
            }
        }
        console.log(formattedChatHistory);
        for await (const [humanMessage, aiMessage] of formattedChatHistory) {
            await memory.saveContext({
                human: humanMessage?.content || ''
            }, {
                ai: aiMessage?.content || ''
            });
        }
        return memory;
    }
};
exports.ChatroomService = ChatroomService;
exports.ChatroomService = ChatroomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        chatHistory_service_1.ChatHistoryService])
], ChatroomService);
//# sourceMappingURL=chatroom.service.js.map