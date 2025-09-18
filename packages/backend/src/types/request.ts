import {Request} from 'express';
import {type User} from '@schema/user.schema'
export  type AppRequest = Request & {
    context: {
        // @ts-ignore
        user?: Partial<User>
    }

};