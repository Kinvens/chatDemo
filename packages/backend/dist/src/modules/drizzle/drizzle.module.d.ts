import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as drizzleSchema from './schema';
export declare const Drizzle: unique symbol;
export type DrizzleDB = NodePgDatabase<typeof drizzleSchema>;
export declare class DrizzleModule {
}
