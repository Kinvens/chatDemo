import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway
} from '@nestjs/websockets';
import {ChatroomService, ConnectionContext} from './chatroom.service';
import {type Socket} from 'socket.io';
import {UnauthorizedException, UseFilters, UseGuards} from '@nestjs/common';
import {WsAuthGuard} from 'src/guards/wsAuth.guard';
import {WsExceptionsFilter} from "../../filters/ws-exception.filter";
import {ChatService} from '../chat/chat.service';
import {User} from "@schema/user.schema";
import {Chat} from "@schema/chat.schema";
import {ChatHistoryService} from '../chatHistory/chatHistory.service';
import {ChatHistoryRole} from "@schema/chatHistory.schema";
import {JwtService} from "@nestjs/jwt";
import {UserService} from '../user/user.service';


@WebSocketGateway(3001, {
    namespace: 'chatroom',
    cors: true
})
@UseGuards(WsAuthGuard)
@UseFilters(WsExceptionsFilter)
export class ChatroomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private connections = new Map<string, ConnectionContext>();

    constructor(private readonly chatroomService: ChatroomService,
                private readonly chatService: ChatService,
                private readonly chatHistoryService: ChatHistoryService,
                private readonly jwtService: JwtService,
                private readonly userService: UserService) {
    }

    async handleConnection(client: Socket & { user?: User }) {
        const token: string = client.handshake.auth.token; // 前端传来的 JWT

        if (!token) {
            throw new UnauthorizedException('Unauthorized');
        }
        try {
            const payload = this.jwtService.verify(token);

            const {userId} = payload
            const user = await this.userService.findOneByUserId(userId);
            if (!user) {
                throw new UnauthorizedException('Unauthorized');
            }
            (client as any).user = user;
        } catch (err) {
            throw new UnauthorizedException('Unauthorized');
        }

        const userId = client.user!.id
        const chatId: string = client.handshake.query.chatId as string;
        console.log('Client connected',userId,chatId);
        if (userId && chatId) {
            const id = `${userId}:${chatId}`
            if (!this.connections.has(id)) {
                const ctx = await this.chatroomService.createContext(
                    userId,
                    chatId,
                )
                this.connections.set(ctx.id, ctx);
            }
        }
        client.emit('connection_ack', {connectionId: client.id});
    }

    async handleDisconnect(client: Socket & { user: User }) {
        const id = client.id;
        const ctx = this.connections.get(id);
        if (ctx) {
            this.connections.delete(id);
        }
    }


    @SubscribeMessage('chat_message')
    async onChatMessage(@MessageBody() payload: {
        text: string
        chatId?: number
    }, @ConnectedSocket() client: Socket & { user: User }) {
        const _this = this
        const {text} = payload
        let {chatId} = payload
        const id = client.id
        const userId = client.user.id

        let chat: Chat | null = null
        //  没有chatId，说明是新的聊天，创建聊天会话记录
        if (!chatId) {
            chat = await this.chatService.create(
                userId,
                text
            )
            chatId = chat.id
        }

        let ctx = this.connections.get(id);
        if (!ctx) {
            ctx = await this.chatroomService.createContext(userId, chatId)
            this.connections.set(ctx.id, ctx);
        }

        const {chain, history} = ctx

        //  保存历史信息
        await this.chatHistoryService.create({
            userId,
            content: text,
            chatId,
            role: ChatHistoryRole.HUMAN
        })

        chain.call({
            human: text
        }, {
            callbacks: [
                {
                    handleLLMNewToken(token: string) {
                        process.stdout.write(token);
                        console.log(token, '------')
                        client.emit('chat_message_token', token);
                    },
                    handleLLMEnd(output) {
                        const text = output.generations[0][0].text
                        console.log("\n生成完成:", text);
                        client.emit('chat_message_end', text);
                        //  保存历史信息
                        _this.chatHistoryService.create({
                            userId,
                            content: text,
                            chatId,
                            role: ChatHistoryRole.AI
                        })
                    },
                    handleLLMError(err) {
                        client.emit('chat_message_error', err);
                        console.error("LLM 出错:", err);
                    },
                },
            ]
        })


        // const { history, chain } = ctx;
        //
        // // 更新历史与生成回复
        // await history.addUserMessage(payload.content);
        // const reply = await chain.run(payload.content);
        //
        // await history.addAiMessage(reply);
        //
        // // 回应客户端
        // client.emit('chat_response', { connectionId: id, text: 'nihao' });
        return {connectionId: id, chat}
    }

    // llm模型中断
    // @SubscribeMessage('abort')
    // findAll() {
    //     return this.chatroomService.findAll();
    // }
}
