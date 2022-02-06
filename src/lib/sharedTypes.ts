export interface OffsetPagingData {
  endPage: number;
  nextPage: number;
  page: number;
  prevPage: number;
  startPage: number;
  totalPage: number;
}

export interface CursorPagingData {
  page: number;
  hasNextPage: boolean;
}
