import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import type { ZodSchema, ZodIssue } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private schema: ZodSchema;

  constructor(schema: ZodSchema) {
    this.schema = schema;
  }

  transform(value: unknown, metadata: ArgumentMetadata) {
    // Only validate request bodies
    if (metadata.type !== 'body') {
      return value;
    }

    const result = this.schema.safeParse(value);
    
    if (!result.success) {
      const formattedErrors = result.error.issues.map((err: ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      throw new BadRequestException({
        message: 'Request payload validation failed',
        error: 'VALIDATION_ERROR',
        details: formattedErrors,
      });
    }

    return result.data;
  }
}
