export type Item = {
  id: number;
  name: string;
  description: string;
  type: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export const SearchSortType = {
  newest: 'newest',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
  name_asc: 'name_asc',
  name_desc: 'name_desc',
} as const;

export type SearchSortType =
  (typeof SearchSortType)[keyof typeof SearchSortType];

export interface SearchItemsParams {
  q?: string;
  sort?: SearchSortType;
  page?: number;
}
