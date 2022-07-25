import { PaginatedDto } from './paginated-response.dto';

export class PaginatedResponseSchema<TData> {
  data: TData;
  pagination_meta: PaginatedDto;
}
