import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { TransformInterceptor } from './utils/transform.interceptor';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set security HTTP headers
  app.use(helmet());

  // Set body parser constraints to protect against payload overflows
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Limit API requests
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes window
      max: 100, // Limit each IP to 100 requests per window
      message: {
        success: false,
        error: {
          message: 'Too many requests from this IP. Please try again after 15 minutes.',
          code: 'TOO_MANY_REQUESTS'
        }
      },
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  // Apply Global Filters and Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Enable CORS with secure configurations
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`=========================================`);
  console.log(` Revora v2 NestJS Backend booting...`);
  console.log(` Listening on: http://localhost:${port}`);
  console.log(`=========================================`);
}
bootstrap();
