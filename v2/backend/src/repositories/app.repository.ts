import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export interface DatabaseStatus {
  connected: boolean;
  readyState: number;
  name: string;
}

@Injectable()
export class AppRepository {
  constructor(@InjectConnection() private connection: Connection) {}

  async getDatabaseStatus(): Promise<DatabaseStatus> {
    const isConnected = this.connection && this.connection.readyState === 1;
    const readyState = this.connection ? this.connection.readyState : 0;
    const dbName = this.connection && this.connection.db ? this.connection.db.databaseName : 'offline';

    return {
      connected: isConnected,
      readyState,
      name: dbName,
    };
  }
}
