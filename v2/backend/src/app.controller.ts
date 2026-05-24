import { Controller, Get, Post, Query, Body, UsePipes, BadRequestException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ZodValidationPipe } from './utils/zod-validation.pipe';
import { z } from 'zod';

const TestValidationSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  age: z.number().min(18, { message: 'Must be at least 18 years old' }),
  email: z.string().email({ message: 'Must be a valid UAE email format' }),
});

type TestDto = z.infer<typeof TestValidationSchema>;

@Controller('api')
export class AppController {
  constructor(@InjectConnection() private connection: Connection) {
    console.log('Injected Mongoose connection:', connection ? 'defined' : 'undefined');
    if (connection) {
      console.log('ReadyState:', connection.readyState);
    }
  }

  @Get('status')
  getStatus(@Query('trigger-error') triggerError?: string) {
    if (triggerError === 'true') {
      throw new BadRequestException('Verification exception forced by status debug flag!');
    }

    const isConnected = this.connection && this.connection.readyState === 1;
    const readyState = this.connection ? this.connection.readyState : 0;
    const dbName = this.connection && this.connection.db ? this.connection.db.databaseName : 'offline';

    return {
      connected: isConnected,
      readyState: readyState,
      name: dbName,
    };
  }

  @Post('test-validation')
  @UsePipes(new ZodValidationPipe(TestValidationSchema))
  testValidation(@Body() body: TestDto) {
    return {
      message: 'Payload verified successfully',
      payload: body,
    };
  }
}
