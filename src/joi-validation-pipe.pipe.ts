import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, { abortEarly: false });

    if (error) {
      throw new BadRequestException(
        error.details.map((_i) => ({ message: _i?.message })),
        'Validation Failed',
      );
    }
    return value;
  }
}