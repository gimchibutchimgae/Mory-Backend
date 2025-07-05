import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5500', // 리액트 포트
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
