import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { TransformInterceptor } from './utils/transform.interceptor';
import { getConfiguration } from './config/configuration';
import { StructuredLogger } from './utils/structured-logger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as express from 'express';

async function bootstrap() {
  const config = getConfiguration();
  const logger = new StructuredLogger();

  // Create Nest application with structured JSON logging module
  const app = await NestFactory.create(AppModule, { logger });
  
  // Set security HTTP headers
  app.use(helmet());

  // Set body parser constraints to protect against payload overflows
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Limit API requests utilizing config constraints
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes window
      max: config.rateLimitMax,
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

  // Enable CORS with production domain safety settings from config
  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

  await app.listen(config.port);
  
  logger.log(`=========================================`, 'Bootstrap');
  logger.log(` Revora v2 NestJS Backend booting...`, 'Bootstrap');
  logger.log(` Environment: [${config.nodeEnv}]`, 'Bootstrap');
  logger.log(` Listening on: http://localhost:${config.port}`, 'Bootstrap');
  logger.log(`=========================================`, 'Bootstrap');
}
bootstrap();
