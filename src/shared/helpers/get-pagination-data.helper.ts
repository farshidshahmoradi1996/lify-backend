import { PaginatedQuery } from '../dto/paginated-query.dto';

interface PaginatedData {
  pageNumber: number;
  totalPages: number;
  hasNextPage: boolean;
  take: number;
  skip: number;
}

export const getPaginationMetaData = (
  paginatedQueryDto: PaginatedQuery,
  count: number,
): PaginatedData => {
  const take = Number(paginatedQueryDto.take) || 10;
  const pageNumber = Number(paginatedQueryDto.pageNumber) || 1;

  const totalPages = Math.ceil(count / take);

  const skip = (pageNumber - 1) * take;
  return {
    pageNumber,
    totalPages,
    hasNextPage: totalPages > pageNumber,
    take,
    skip,
  };
};
