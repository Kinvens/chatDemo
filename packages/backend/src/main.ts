import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import {BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const formattedErrors = errors.map(err => ({
        field: err.property,
        messages: Object.values(err.constraints || {}),
      }));
      const firstError = formattedErrors[0].messages[0]
      return new BadRequestException({
        error: firstError,
        message:firstError
      });
    },
  }));
  app.enableCors({
    cors: true
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
