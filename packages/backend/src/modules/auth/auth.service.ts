import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UserService} from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) {
    }

    async signIn(
        username: string,
        pass: string,
    ): Promise<{
        accessToken: string,
        userId: string,
        account: string,
    }> {
        const user = await this.usersService.findOneByAccount(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = {userId: user.id, account: user.account};
        return {
            userId: user.id,
            account: user.account,
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}
