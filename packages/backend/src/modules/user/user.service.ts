import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {Drizzle, type DrizzleDB} from "../drizzle/drizzle.module";
import {and, eq} from "drizzle-orm";
import {users} from "../drizzle/schema";

@Injectable()
export class UserService {
    constructor(@Inject(Drizzle) private readonly db: DrizzleDB) {
    }

    async create(createUserDto: CreateUserDto) {
        const {account, password, confirmPassword} = createUserDto;
        if (password !== confirmPassword) {
            throw new BadRequestException(`Passwords do not match confirmPassword.`);
        }

        // 查询是否存在
        const user = await this.db.query.users.findFirst({
            where: eq(
                users.account, account
            )
        })
        if (user) {
            throw new BadRequestException('User already exist.');
        }

        const newUser = await this.db.insert(users).values({
            account,
            password,
        })
        if (!newUser) {
            throw new BadRequestException('User created error!');
        }

        return
    }

    async findOneByAccount(account: string) {
        return await this.db.query.users.findFirst({
            where: and(
                eq(
                    users.account, account,
                ),
                eq(
                    users.isDeleted, false
                )
            ),
            columns: {
                account: true,
                id: true,
                createdAt: true,
                updatedAt: true,
                password: true,
            }
        })
    }

    async findOneByUserId(userId: string) {
        return await this.db.query.users.findFirst({
            where: and(
                eq(
                    users.id, userId,
                ),
                eq(
                    users.isDeleted, false
                )
            ),
            columns: {
                account: true,
                id: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    }
}
