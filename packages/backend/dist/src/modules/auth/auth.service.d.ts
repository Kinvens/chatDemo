import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    signIn(username: string, pass: string): Promise<{
        accessToken: string;
        userId: string;
        account: string;
    }>;
}
