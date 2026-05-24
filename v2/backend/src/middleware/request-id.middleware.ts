import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Read header or generate new UUID
    const requestIdHeader = req.headers['x-request-id'];
    const requestId = Array.isArray(requestIdHeader)
      ? requestIdHeader[0]
      : requestIdHeader || crypto.randomUUID();

    // Assign to request context
    req.headers['x-request-id'] = requestId;
    (req as any).requestId = requestId;

    // Send header back in response
    res.setHeader('X-Request-ID', requestId);

    next();
  }
}
