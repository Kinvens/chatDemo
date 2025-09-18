"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({
    path: '.env'
});
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/modules/drizzle/schema/**.schema.ts',
    out: './src/modules/drizzle/migrate',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL || '',
    },
});
//# sourceMappingURL=drizzle.config.js.map