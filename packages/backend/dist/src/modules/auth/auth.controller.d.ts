import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(signInDto: SignInDto): Promise<{
        accessToken: string;
        userId: string;
        account: string;
    }>;
}
