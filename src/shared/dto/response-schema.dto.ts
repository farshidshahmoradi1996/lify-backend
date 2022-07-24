import { ApiProperty } from '@nestjs/swagger';

export class ResponseSchemaDto<TData> {
  result: TData;

  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;
}
