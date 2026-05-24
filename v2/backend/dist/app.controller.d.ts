import { Connection } from 'mongoose';
import { z } from 'zod';
declare const TestValidationSchema: z.ZodObject<{
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodString;
}, z.core.$strip>;
type TestDto = z.infer<typeof TestValidationSchema>;
export declare class AppController {
    private connection;
    constructor(connection: Connection);
    getStatus(triggerError?: string): {
        connected: boolean;
        readyState: number;
        name: string;
    };
    testValidation(body: TestDto): {
        message: string;
        payload: {
            name: string;
            age: number;
            email: string;
        };
    };
}
export {};
