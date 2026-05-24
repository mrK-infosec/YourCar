import { z } from 'zod';
import { AppService } from './app.service';
declare const TestValidationSchema: z.ZodObject<{
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodString;
}, z.core.$strip>;
type TestDto = z.infer<typeof TestValidationSchema>;
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStatus(triggerError?: string, req?: any): Promise<import("./repositories/app.repository").DatabaseStatus>;
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
