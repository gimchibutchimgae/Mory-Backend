import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // 모든 출처 허용 (개발용)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // 필요하면
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 값은 자동 제거
      forbidNonWhitelisted: true, // DTO에 없는 값이 들어오면 에러
      transform: true, // string -> number 등 자동 변환
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
