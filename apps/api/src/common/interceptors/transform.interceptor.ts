import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        // If already formatted with success property, return directly
        if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
          return res;
        }

        if (res && typeof res === 'object' && 'meta' in res && 'data' in res) {
          return {
            success: true,
            data: res.data,
            meta: res.meta,
          };
        }

        return {
          success: true,
          data: res,
        };
      }),
    );
  }
}

