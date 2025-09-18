import { ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
export declare class WsExceptionsFilter implements WsExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
