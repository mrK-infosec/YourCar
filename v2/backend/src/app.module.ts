import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { getConnectionToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

const mongooseConnectionProvider = {
  provide: getConnectionToken(),
  useFactory: async (): Promise<mongoose.Connection> => {
    try {
      console.log('Attempting singleton MongoDB connection...');
      await mongoose.connect(
        process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/revora_v2',
        {
          maxPoolSize: 50,
          serverSelectionTimeoutMS: 2000,
        }
      );
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
  controllers: [AppController],
  providers: [AppService, mongooseConnectionProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
