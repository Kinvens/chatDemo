import { ConfigService } from '@nestjs/config';
import { BufferWindowMemory } from 'langchain/memory';
import { ChatHistoryService } from "../chatHistory/chatHistory.service";
import { ConversationChain } from "langchain/chains";
export type ConnectionContext = {
    id: string;
    chain: ConversationChain;
    createdAt: Date;
    history: BufferWindowMemory;
};
export declare class ChatroomService {
    private readonly configService;
    private readonly chatHistoryService;
    constructor(configService: ConfigService, chatHistoryService: ChatHistoryService);
    createContext(userId: string, chatId: number | string): Promise<{
        id: string;
        createdAt: Date;
        history: BufferWindowMemory;
        chain: ConversationChain;
    }>;
    createLangChainHistory(userId: string, chatId: number): Promise<BufferWindowMemory>;
}
