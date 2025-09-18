import {Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ChatService} from './chat.service';
import {type Request} from 'express'
import {User} from "@schema/user.schema";
import {AuthGuard} from "../../guards/auth.guard";

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }

    @Get('findAll')
    async findAll(@Req() req: Request & {
        user: User
    }) {
        const {user} = req
        return this.chatService.findAllByUserId(user.id)
    }

}
