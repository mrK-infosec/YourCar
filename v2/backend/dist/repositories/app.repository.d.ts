import { Connection } from 'mongoose';
export interface DatabaseStatus {
    connected: boolean;
    readyState: number;
    name: string;
}
export declare class AppRepository {
    private connection;
    constructor(connection: Connection);
    getDatabaseStatus(): Promise<DatabaseStatus>;
}
