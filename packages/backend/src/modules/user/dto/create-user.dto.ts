import { NewUser } from "@schema/user.schema";
import {IsNotEmpty} from "class-validator";

export class CreateUserDto implements NewUser {
    @IsNotEmpty()
    account: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    confirmPassword: string;
}
