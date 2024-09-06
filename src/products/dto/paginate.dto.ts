export interface PaginatedResource<T> {
  totalItems: number;
  items: T;
  page: number;
  hasMore?: boolean;
  replace?: string;
  view?: string;
}
