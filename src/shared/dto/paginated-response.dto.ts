import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto {
  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  count: number;
}
