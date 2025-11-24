import { Item } from '../domains/entities/Item';

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

export interface ISearchItemsInteractor {
  execute(params: SearchItemsParams): Promise<Item[]>;
}
