import {defineConfig} from 'drizzle-kit';
import {config} from 'dotenv';

config({
    path: '.env'
});
export default defineConfig({
    schema: './src/modules/drizzle/schema/**.schema.ts', // 指定schema路径
    out:'./src/modules/drizzle/migrate',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL || '',
    },
});