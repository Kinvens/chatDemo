import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query} from '@nestjs/common';
import {ChatHistoryService} from './chatHistory.service';
import {AuthGuard} from "../../guards/auth.guard";
import type {Request} from "express";
import {User} from "@schema/user.schema";
import {FindAllChatHistoryDto} from "./dto/find-all-chat-history.dto";

@Controller('chatHistory')
@UseGuards(AuthGuard)
export class ChatHistoryController {
    constructor(private readonly chatHistoryService: ChatHistoryService) {
    }

    @Get('findAll')
    async findAll(@Req() req: Request & {
        user: User
    }, @Query() findAllChatHistoryDto: FindAllChatHistoryDto) {
        const {user} = req
        const {chatId} = findAllChatHistoryDto;
        return this.chatHistoryService.findAll({
            userId: user.id,
            chatId:Number(chatId),
            orderBy:'asc'
        })
    }

}
