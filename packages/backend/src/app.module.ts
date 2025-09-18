import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {DrizzleModule} from './modules/drizzle/drizzle.module';
import {UserModule} from './modules/user/user.module';
import {AuthModule} from './modules/auth/auth.module';
import {ChatModule} from './modules/chat/chat.module';
import {AiModule} from './modules/ai/ai.module';
import {ChatroomModule} from './modules/chatroom/chatroom.module'
import {ChatHistoryModule} from "./modules/chatHistory/chatHistory.module";


@Module({
    imports: [ConfigModule.forRoot({isGlobal: true}), DrizzleModule, UserModule, AuthModule,
        ChatModule,
        ChatHistoryModule,
        ChatroomModule,
        AiModule,],
    controllers: [],
    providers: [],
})
export class AppModule {
}
