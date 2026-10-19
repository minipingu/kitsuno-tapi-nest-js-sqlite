import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let details = '';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as any).message || (res as any).error || message;
        details = Array.isArray((res as any).message)
          ? (res as any).message.join(', ')
          : '';
      }
    } else if (exception instanceof Error) {
      details = exception.message;
      this.logger.error(exception.stack);
    }

    // If it's an API request, return JSON
    if (request.url.startsWith('/api') || request.url.startsWith('/v1/api')) {
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        details: details || undefined,
      });
    }

    // For web requests, render the error view
    return response.status(status).render('error', {
      statusCode: status,
      errorMessage: message,
      errorDetails: details,
      timestamp: new Date().toLocaleString(),
      user: request.user,
    });
  }
}
