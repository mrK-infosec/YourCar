import { Connection } from 'mongoose';
export declare class AppController {
    private connection;
    constructor(connection: Connection);
    getStatus(): {
        status: string;
        timestamp: string;
        database: {
            connected: boolean;
            readyState: import("mongoose").ConnectionStates;
            name: string;
        };
    };
}
