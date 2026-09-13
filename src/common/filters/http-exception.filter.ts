import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

// Minimal bootstrap implementation: a completely empty method body is valid
// TypeScript/NestJS here, but the comment documents intent and keeps this
// from reading as an accidental no-op once real logic is added later.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    // Final error response formatting is not implemented yet.
  }
}
