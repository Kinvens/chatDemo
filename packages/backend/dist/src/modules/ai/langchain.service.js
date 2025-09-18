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
exports.LangChainService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("@langchain/openai");
let LangChainService = class LangChainService {
    llm;
    constructor() {
        this.llm = new openai_1.ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: "glm-4.5",
            temperature: 0.7,
            streaming: true,
            configuration: {
                baseURL: process.env.OPENAI_BASE_URL,
            },
        });
    }
    async send(text) {
        const res = await this.llm.invoke(text, {
            callbacks: [
                {
                    handleLLMNewToken(token) {
                        process.stdout.write(token);
                    },
                    handleLLMEnd(output) {
                        console.log("\n生成完成:", output.generations[0][0].text);
                    },
                    handleLLMError(err) {
                        console.error("LLM 出错:", err);
                    },
                },
            ]
        });
        console.log(JSON.stringify(res.content));
        return res;
    }
    getMemory(chatHistories) {
    }
};
exports.LangChainService = LangChainService;
exports.LangChainService = LangChainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LangChainService);
//# sourceMappingURL=langchain.service.js.map