import {Global, Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {drizzle, NodePgDatabase} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';
import * as drizzleSchema from './schema'

export const Drizzle = Symbol('Drizzle-Connection');
export type DrizzleDB = NodePgDatabase<typeof drizzleSchema>

@Global()
@Module({
    providers: [
        {
            provide: Drizzle,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const databaseUrl = configService.get<string>('POSTGRES_URL');
                const pool = new Pool({
                    connectionString: databaseUrl,
                });
                return drizzle(pool, {
                    schema: drizzleSchema
                }) as DrizzleDB;
            },
        },
    ],
    exports: [Drizzle],
})
export class DrizzleModule {
}
