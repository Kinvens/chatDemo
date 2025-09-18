import { Request } from 'express';
import { type User } from '@schema/user.schema';
export type AppRequest = Request & {
    context: {
        user?: Partial<User>;
    };
};
