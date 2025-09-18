import {Body, Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {AuthGuard} from 'src/guards/auth.guard';
import {LangChainService} from "../ai/langchain.service";


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly langChainService: LangChainService) {
    }

    @Post('create')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('send')
    async send(@Body("text") text: string) {
        console.log(text);
        const res = await this.langChainService.send(text);
        return res
    }
}
