import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Socket} from 'socket.io';
import {UserService} from 'src/modules/user/user.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {
    }

    async canActivate(context: ExecutionContext) {
        const client: Socket = context.switchToWs().getClient<Socket>();
        const token: string = client.handshake.auth.token; // 前端传来的 JWT

        if (!token) {
            throw new UnauthorizedException('Unauthorized');
        }

        try {
            const payload = this.jwtService.verify(token);

            const {userId} = payload
            const user = await this.userService.findOneByUserId(userId);
            if(!user) {
                throw new UnauthorizedException('Unauthorized');
            }
            (client as any).user = user;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
