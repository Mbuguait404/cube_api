import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LogsService } from '../../logs/logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query, ip, user } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    // Skip logging for certain paths if needed
    // We skip logging the logs endpoints to avoid recursion or excessive noise
    if (url.includes('/admin/logs')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((responseBody) => {
        const duration = Date.now() - startTime;
        const statusCode = context.switchToHttp().getResponse().statusCode;

        this.logsService.create({
          method,
          url,
          statusCode,
          duration,
          ip,
          userId: user?._id,
          userEmail: user?.email,
          requestBody: this.sanitizeData(body),
          requestParams: params,
          requestQuery: query,
          responseBody: this.sanitizeData(responseBody, true),
          userAgent,
        }).catch(err => console.error('Error saving log:', err));
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        this.logsService.create({
          method,
          url,
          statusCode,
          duration,
          ip,
          userId: user?._id,
          userEmail: user?.email,
          requestBody: this.sanitizeData(body),
          requestParams: params,
          requestQuery: query,
          errorMessage: error.message,
          errorStack: error.stack,
          userAgent,
        }).catch(err => console.error('Error saving error log:', err));

        return throwError(() => error);
      }),
    );
  }

  private sanitizeData(data: any, isResponse = false) {
    if (!data) return data;
    
    // Deep clone to avoid modifying the actual request/response
    let sanitized = JSON.parse(JSON.stringify(data));

    const sensitiveFields = ['password', 'token', 'refreshToken', 'accessToken', 'secret'];
    
    const removeSensitive = (obj: any) => {
      if (typeof obj !== 'object' || obj === null) return;
      
      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          obj[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          removeSensitive(obj[key]);
        }
      }
    };

    removeSensitive(sanitized);

    // Truncate large data
    const str = JSON.stringify(sanitized);
    if (str.length > 10000) {
      return { 
        message: 'Data too large to log', 
        truncated: true,
        size: str.length 
      };
    }

    return sanitized;
  }
}
