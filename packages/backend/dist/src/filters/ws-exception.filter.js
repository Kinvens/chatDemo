"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let WsExceptionsFilter = class WsExceptionsFilter {
    catch(exception, host) {
        const client = host.switchToWs().getClient();
        const data = host.switchToWs().getData();
        console.error(`Exception thrown: ${exception.message}`, exception.stack);
        const isAuth = exception instanceof common_1.UnauthorizedException;
        client.emit('exception', {
            event: isAuth ? 'Unauthorized' : data?.event || 'unknown',
            message: exception.message || 'Internal server error',
        });
    }
};
exports.WsExceptionsFilter = WsExceptionsFilter;
exports.WsExceptionsFilter = WsExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], WsExceptionsFilter);
//# sourceMappingURL=ws-exception.filter.js.map