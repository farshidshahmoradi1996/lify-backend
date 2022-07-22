import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseSchemaDto } from '../dto/response-schema.dto';

export const ApiResponseSchema = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseSchemaDto) },
          {
            properties: {
              result: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
