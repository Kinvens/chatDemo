"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_module_1 = require("../drizzle/drizzle.module");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema");
let UserService = class UserService {
    db;
    constructor(db) {
        this.db = db;
    }
    async create(createUserDto) {
        const { account, password, confirmPassword } = createUserDto;
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException(`Passwords do not match confirmPassword.`);
        }
        const user = await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.account, account)
        });
        if (user) {
            throw new common_1.BadRequestException('User already exist.');
        }
        const newUser = await this.db.insert(schema_1.users).values({
            account,
            password,
        });
        if (!newUser) {
            throw new common_1.BadRequestException('User created error!');
        }
        return;
    }
    async findOneByAccount(account) {
        return await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.account, account), (0, drizzle_orm_1.eq)(schema_1.users.isDeleted, false)),
            columns: {
                account: true,
                id: true,
                createdAt: true,
                updatedAt: true,
                password: true,
            }
        });
    }
    async findOneByUserId(userId) {
        return await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.users.id, userId), (0, drizzle_orm_1.eq)(schema_1.users.isDeleted, false)),
            columns: {
                account: true,
                id: true,
                createdAt: true,
                updatedAt: true,
            }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(drizzle_module_1.Drizzle)),
    __metadata("design:paramtypes", [Object])
], UserService);
//# sourceMappingURL=user.service.js.map