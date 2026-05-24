import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarController } from './controllers/car.controller';
import { CarService } from './services/car.service';
import { CarRepository } from './repositories/car.repository';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { AppRepository } from './repositories/app.repository';
import { CacheService } from './services/cache.service';
import { getConnectionToken } from '@nestjs/mongoose';
import getConfiguration from './config/configuration';
import * as mongoose from 'mongoose';

const config = getConfiguration();

const mongooseConnectionProvider = {
  provide: getConnectionToken(),
  useFactory: async (): Promise<mongoose.Connection> => {
    try {
      console.log('Attempting singleton MongoDB connection...');
      await mongoose.connect(config.mongodbUri, {
        maxPoolSize: 50,
        serverSelectionTimeoutMS: 2000,
      });
      console.log('MongoDB connection established successfully! (Singleton)');
    } catch (err: any) {
      console.error('MongoDB connection failed:', err.message);
      console.log('Warning: Server will continue booting, but database operations will fail.');
    }
    const connection = mongoose.connection || mongoose.connections[0];
    return connection || { readyState: 0, db: { databaseName: 'offline' } } as any;
  },
};

@Module({
  imports: [],
  controllers: [AppController, CarController],
  providers: [
    AppService,
    AppRepository,
    CarService,
    CarRepository,
    CacheService,
    mongooseConnectionProvider,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, LoggingMiddleware)
      .forRoutes('*');
  }
}
