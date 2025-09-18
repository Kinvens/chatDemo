import {forwardRef, Global, Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {AuthModule} from "../auth/auth.module";
import {AiModule} from "../ai/ai.module";

@Global()
@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [AiModule],
    exports: [UserService],
})
export class UserModule {
}
