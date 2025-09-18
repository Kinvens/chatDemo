import {ArgumentsHost, Catch, UnauthorizedException, WsExceptionFilter} from '@nestjs/common';
import {Socket} from 'socket.io';

@Catch()
export class WsExceptionsFilter implements WsExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const client: Socket = host.switchToWs().getClient<Socket>();
        const data = host.switchToWs().getData();
        // 日志记录
        console.error(`Exception thrown: ${exception.message}`, exception.stack);

        const isAuth = exception instanceof UnauthorizedException

        // 响应客户端
        client.emit('exception', {
            event: isAuth ? 'Unauthorized' : data?.event || 'unknown',
            message: exception.message || 'Internal server error',
        });
    }
}
