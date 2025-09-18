import { CreateUserDto } from './dto/create-user.dto';
import { type DrizzleDB } from "../drizzle/drizzle.module";
export declare class UserService {
    private readonly db;
    constructor(db: DrizzleDB);
    create(createUserDto: CreateUserDto): Promise<void>;
    findOneByAccount(account: string): Promise<{
        password: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        account: string;
    } | undefined>;
    findOneByUserId(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        account: string;
    } | undefined>;
}
