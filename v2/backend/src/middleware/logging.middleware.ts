import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      const logFormat = `[${method}] ${originalUrl} | Status: ${statusCode} | Client IP: ${ip} | Duration: ${duration}ms | UserAgent: ${userAgent}`;

      if (statusCode >= 500) {
        this.logger.error(logFormat);
      } else if (statusCode >= 400) {
        this.logger.warn(logFormat);
      } else {
        this.logger.log(logFormat);
      }
    });

    next();
  }
}
