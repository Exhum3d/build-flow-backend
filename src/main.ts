import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors();
  // app.useGlobalGuards(new JwtAuthGuard());
  await app.listen(3000);
}
bootstrap();
