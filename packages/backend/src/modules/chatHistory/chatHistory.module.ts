import { Module } from '@nestjs/common';
import { ChatHistoryService } from './chatHistory.service';
import { ChatHistoryController } from './chatHistory.controller';

@Module({
  controllers: [ChatHistoryController],
  providers: [ChatHistoryService],
  exports: [ChatHistoryService],
})
export class ChatHistoryModule {}
