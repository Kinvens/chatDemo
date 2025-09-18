import {User} from "@schema/user.schema";
import {IsNotEmpty} from "class-validator";

export class SignInDto implements Pick<User, "account" | "password"> {
    @IsNotEmpty()
    account: string;
    @IsNotEmpty()
    password: string;
}
