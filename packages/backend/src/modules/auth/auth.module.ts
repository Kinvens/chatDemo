import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule,} from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";

@Module({
    providers: [AuthService],
    imports: [
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                    signOptions: {expiresIn: '1d'},
                }
            }
        })],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {
}
