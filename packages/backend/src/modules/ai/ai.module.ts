import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import {LangChainService} from "./langchain.service";

@Module({
  providers: [LangChainService, AiService],
  exports:[LangChainService]
})
export class AiModule {}
