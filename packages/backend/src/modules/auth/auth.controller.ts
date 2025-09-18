import {Body, Controller, Post, UseGuards } from '@nestjs/common';
import {AuthService} from "./auth.service";
import {SignInDto} from "./dto/sign-in";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.account, signInDto.password);
    }
}
