import { ApiProperty } from '@nestjs/swagger';

export class PaginatedQuery {
  @ApiProperty({ default: '10', required: false })
  take: string;

  @ApiProperty({ default: '1', required: false })
  pageNumber: string;
}
