import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {type Request} from 'express';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private readonly configService: ConfigService, private readonly userService: UserService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const jwtSecret = this.configService.get<string>('JWT_SECRET');
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtSecret
                }
            );
            const {userId} = payload
            const user = await this.userService.findOneByUserId(userId);
            if (!user) {
                throw new UnauthorizedException('Unauthorized');
            }
            (request as any).user = user;
            return true;
            request['user'] = user;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
