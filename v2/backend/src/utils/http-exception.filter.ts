import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    let details: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent = exception.getResponse();
      
      if (typeof resContent === 'object' && resContent !== null) {
        message = (resContent as any).message || exception.message;
        code = (resContent as any).error || 'BAD_REQUEST';
        details = (resContent as any).details || undefined;
      } else {
        message = exception.message;
        code = exception.name || 'HTTP_EXCEPTION';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      code = exception.name || 'ERROR';
    }

    // Log the error
    console.error(`[Error] [${new Date().toISOString()}] Status: ${status} | Code: ${code} | Message: ${message}`);

    response.status(status).json({
      success: false,
      error: {
        message,
        code,
        ...(details ? { details } : {}),
      },
    });
  }
}

