import { PaginatedQuery } from '../dto/paginated-query.dto';

interface PaginatedData {
  take: number;
  skip: number;
  pageNumber: number;
  totalPages: number;
  count: number;
}

export const getPaginationData = (
  paginatedQueryDto: PaginatedQuery,
  count: number,
): PaginatedData => {
  const take = Number(paginatedQueryDto.take) || 10;
  const pageNumber = Number(paginatedQueryDto.pageNumber) || 1;
  const skip = (pageNumber - 1) * take;
  return {
    take,
    skip,
    pageNumber,
    totalPages: Math.ceil(count / take),
    count,
  };
};
