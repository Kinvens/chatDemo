import {Injectable} from '@nestjs/common';
import {ChatOpenAI} from "@langchain/openai";
import {ConfigService} from '@nestjs/config';
import {BufferWindowMemory} from 'langchain/memory'
import {ChatHistoryService} from "../chatHistory/chatHistory.service";
import {ChatHistory} from "@schema/chatHistory.schema";
import {ConversationChain} from "langchain/chains";
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

export type ConnectionContext = {
    id: string;
    chain: ConversationChain
    createdAt: Date;
    history: BufferWindowMemory;
};


type AiMessage = Omit<ChatHistory, 'role'> & {
    role: 'ai'
}
type HumanMessage = Omit<ChatHistory, 'role'> & {
    role: 'human'
}
type MessageContext = [HumanMessage | undefined, AiMessage | undefined]

@Injectable()
export class ChatroomService {
    constructor(private readonly configService: ConfigService,
                private readonly chatHistoryService: ChatHistoryService) {
    }

    async createContext(userId: string, chatId: number | string) {
        const id = `${userId}:${chatId}`;
        const history = await this.createLangChainHistory(userId, Number(chatId))
        const chat = new ChatOpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
            model: "glm-4.5",
            temperature: 0.7,
            streaming: true,
            configuration: {
                baseURL: this.configService.get<string>('OPENAI_BASE_URL'),
            },

        })
        const prompt = ChatPromptTemplate.fromPromptMessages([
            { role: "system", content: "你是一个聊天 AI。" },
            new MessagesPlaceholder("chat_history"),
            { role: "human", content: "{human}" },  // <-- 这里用了 input
        ]);

        const chain = new ConversationChain({
            llm: chat,
            prompt,
            memory: history,
        })
        return {
            id,
            createdAt: new Date(),
            history,
            chain,
        }
    }

    async createLangChainHistory(userId: string, chatId: number) {
        const memory = new BufferWindowMemory({
            humanPrefix: 'human',
            aiPrefix: 'ai',
            k: 10, // 只保留最近 10 条消息
            memoryKey: "chat_history",
            returnMessages: true
        });
        // 获取最近的10条聊天记录
        const chatHistories = await this.chatHistoryService.findAll({
            userId,
            chatId: chatId,
            count: 10,
            orderBy: 'desc'
        })

        const formattedChatHistory: MessageContext[] = []
        let tempMessage: MessageContext = [undefined, undefined]
        while (chatHistories.length > 0) {
            const lastChatHistory = chatHistories.pop()!;
            const {role} = lastChatHistory
            if (role === 'human') {
                tempMessage[0] = lastChatHistory as HumanMessage
            }
            if (role === 'ai') {
                tempMessage[1] = lastChatHistory as AiMessage
                formattedChatHistory.push(tempMessage)
                tempMessage = [undefined, undefined]
            }
        }
        console.log(formattedChatHistory)
        for await (const [humanMessage, aiMessage] of formattedChatHistory) {
            await memory.saveContext({
                human: humanMessage?.content || ''
            }, {
                ai: aiMessage?.content || ''
            })
        }


        return memory

    }
}
