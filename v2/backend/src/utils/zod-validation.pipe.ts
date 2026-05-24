import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    // Only validate request bodies
    if (metadata.type !== 'body') {
      return value;
    }

    const result = this.schema.safeParse(value);
    
    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
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
