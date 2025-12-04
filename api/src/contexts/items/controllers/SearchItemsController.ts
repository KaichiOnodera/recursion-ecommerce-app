import express from 'express';
import { GetRes } from '@shared/types/gets';
import { ISearchItemsInteractor } from '../usecases/ISearchItemsInteractor';
import { SearchItemsParams, SearchSortType } from '@shared/schemas/item';

type SearchParamsResult =
  | { success: true; params: SearchItemsParams }
  | { success: false; error: string };

export class SearchItemsController {
  constructor(private readonly searchItemsInteractor: ISearchItemsInteractor) {}

  async execute(
    req: express.Request,
    res: express.Response<GetRes['/items/search'] | { message: string }>,
  ) {
    const result = this.buildSearchParams(req.query);

    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }

    const items = await this.searchItemsInteractor.execute(result.params);

    const responseItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    res.status(200).json({ items: responseItems });
  }

  private buildSearchParams(
    query: express.Request['query'],
  ): SearchParamsResult {
    const params: SearchItemsParams = {};

    if (query.q) {
      if (typeof query.q === 'string') {
        params.q = query.q;
      } else {
        return { success: false, error: 'Invalid query parameter.' };
      }
    }

    if (query.sort) {
      if (this.isValidSortType(query.sort)) {
        params.sort = query.sort;
      } else {
        return {
          success: false,
          error: `Invalid sort parameter.`,
        };
      }
    }

    if (query.page) {
      const pageNum = this.parsePageNumber(query.page);
      if (pageNum !== null && pageNum > 0) {
        params.page = pageNum;
      } else {
        return {
          success: false,
          error: 'Invalid page parameter.',
        };
      }
    }

    return { success: true, params };
  }

  private isValidSortType(value: unknown): value is SearchSortType {
    return (
      typeof value === 'string' &&
      Object.values(SearchSortType).includes(value as SearchSortType)
    );
  }

  private parsePageNumber(value: unknown): number | null {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  }
}
