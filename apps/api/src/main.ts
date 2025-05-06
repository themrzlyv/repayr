import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { CoreModule } from './core/core.module';
import { SessionMiddleware } from './shared/middlewares/session-middleware';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  const config = app.get(ConfigService);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Csrf-Token'],
  });

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  const sessionMiddleware = app.get(SessionMiddleware);

  app.use(sessionMiddleware.middleware);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(8000);
}
bootstrap();
