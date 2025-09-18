type ChatHistory = {
    role: 'human' | 'user';
    content: string;
};
export declare class LangChainService {
    private llm;
    constructor();
    send(text: string): Promise<import("@langchain/core/messages").AIMessageChunk>;
    getMemory(chatHistories: ChatHistory[]): void;
}
export {};
