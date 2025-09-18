import { User } from "@schema/user.schema";
export declare class SignInDto implements Pick<User, "account" | "password"> {
    account: string;
    password: string;
}
