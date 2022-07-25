import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from '../dto/paginated-response.dto';
import { ResponseSchemaDto } from '../dto/response-schema.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseSchemaDto) },
          {
            properties: {
              result: {
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  pagination_meta: { $ref: getSchemaPath(PaginatedDto) },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
