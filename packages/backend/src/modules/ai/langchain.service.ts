import {Injectable} from '@nestjs/common';
import {ChatOpenAI, ChatOpenAIFields} from "@langchain/openai";
import {HumanMessage, AIMessage} from "@langchain/core/messages";
import { ChatMessageHistory } from "langchain/memory";
type ChatHistory = {
    role: 'human' | 'user',
    content: string,
};

@Injectable()
export class LangChainService {
    private llm: ChatOpenAI

    constructor() {
        this.llm = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: "glm-4.5",
            temperature: 0.7,
            streaming: true,
            configuration: {
                baseURL: process.env.OPENAI_BASE_URL,
            },
        })
    }

    async send(
        text: string,
    ) {
        const res = await this.llm.invoke(text, {
            callbacks: [
                {
                    handleLLMNewToken(token: string) {

                        process.stdout.write(token); // 实时输出 token
                    },
                    handleLLMEnd(output) {
                        console.log("\n生成完成:", output.generations[0][0].text);
                    },
                    handleLLMError(err) {

                        console.error("LLM 出错:", err);
                    },
                },
            ]
        })
        console.log(JSON.stringify(res.content))
        return res
    }

    // 获取历史对话记录，并且使用llm精简对话记录
    getMemory(chatHistories: ChatHistory[]) {
        // const memory = new ConversationSummaryMemory({
        //     llm: this.llm,
        //     maxToken
        //     returnMessages: true,
        // });
        // const formatChatHistories = chatHistories.map(chatHistory => {
        //     const {role, content} = chatHistory;
        //     return role === 'human' ?
        // })
    }
}
