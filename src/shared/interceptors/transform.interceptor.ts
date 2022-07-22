import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseSchemaDto } from '../dto/response-schema.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseSchemaDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseSchemaDto<T>> {
    console.log(context);

    return next.handle().pipe(
      map((data) => ({
        data,
        message: '',
        statusCode: 200,
      })),
    );
  }
}
