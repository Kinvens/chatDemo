import { NewUser } from "@schema/user.schema";
export declare class CreateUserDto implements NewUser {
    account: string;
    password: string;
    confirmPassword: string;
}
