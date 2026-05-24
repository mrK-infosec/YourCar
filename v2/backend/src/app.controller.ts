import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('api')
export class AppController {
  constructor(@InjectConnection() private connection: Connection) {}

  @Get('status')
  getStatus() {
    const isConnected = this.connection.readyState === 1;
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        connected: isConnected,
        readyState: this.connection.readyState,
        name: this.connection.db?.databaseName || 'unknown'
      }
    };
  }
}
