import { Controller, Get, Post, Query, Body, UsePipes, BadRequestException, Req } from '@nestjs/common';
import { Request } from 'express';
import { ZodValidationPipe } from './utils/zod-validation.pipe';
import { z } from 'zod';
import { AppService } from './app.service';

const TestValidationSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  age: z.number().min(18, { message: 'Must be at least 18 years old' }),
  email: z.string().email({ message: 'Must be a valid UAE email format' }),
});

type TestDto = z.infer<typeof TestValidationSchema>;

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  async getStatus(@Query('trigger-error') triggerError?: string, @Req() req?: any) {
    if (triggerError === 'true') {
      throw new BadRequestException('Verification exception forced by status debug flag!');
    }

    const requestId = req?.headers['x-request-id'] || 'no-trace';
    const startMemory = process.memoryUsage().heapUsed;

    // Delegate business and database query logic to service & repository layers
    const dbStatus = await this.appService.getDatabaseStatus();

    const endMemory = process.memoryUsage().heapUsed;
    const memoryDeltaKB = Math.round((endMemory - startMemory) / 1024);

    console.log(
      `[Metrics] RequestID: ${requestId} | Memory Delta: ${memoryDeltaKB} KB | Current Heap: ${Math.round(
        endMemory / 1024 / 1024
      )} MB`
    );

    return dbStatus;
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
