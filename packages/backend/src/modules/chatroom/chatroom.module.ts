import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomGateway } from './chatroom.gateway';
import {UserModule} from "../user/user.module";
import {ChatModule} from "../chat/chat.module";
import {ChatHistoryModule} from "../chatHistory/chatHistory.module";

@Module({
  imports:[UserModule,ChatModule,ChatHistoryModule],
  providers: [ChatroomGateway, ChatroomService],
})
export class ChatroomModule {}
