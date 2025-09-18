import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LangChainService } from "../ai/langchain.service";
export declare class UserController {
    private readonly userService;
    private readonly langChainService;
    constructor(userService: UserService, langChainService: LangChainService);
    create(createUserDto: CreateUserDto): Promise<void>;
    getProfile(req: any): any;
    send(text: string): Promise<import("@langchain/core/messages", { with: { "resolution-mode": "import" } }).AIMessageChunk>;
}
