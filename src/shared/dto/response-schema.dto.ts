import { ApiProperty } from '@nestjs/swagger';

export class ResponseSchemaDto<TData> {
  data: TData;

  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;
}
