import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/revora_v2',
      {
        maxPoolSize: 50,
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('MongoDB connection established successfully! (Singleton)');
          });
          connection.on('error', (err: any) => {
            console.error('MongoDB connection error:', err);
          });
          return connection;
        },
      }
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
