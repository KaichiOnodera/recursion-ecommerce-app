import express from 'express';
import { GetRes } from '@shared/types/gets';
import { ISearchItemsInteractor } from '../usecases/ISearchItemsInteractor';
import {
  SearchItemsParams,
  SearchSortType,
  InventoryStatus,
} from '@shared/schemas/item';
import { AuthenticatedRequest } from '../../../middlewares';
import { parseJsonToNumberArray } from '../../../utils/parseJson';

type SearchParamsResult =
  | { success: true; params: SearchItemsParams }
  | { success: false; error: string };

export class SearchItemsController {
  constructor(private readonly searchItemsInteractor: ISearchItemsInteractor) {}

  async execute(
    req: AuthenticatedRequest<Record<string, never>>,
    res: express.Response<GetRes['/items/search'] | { message: string }>,
  ) {
    const result = this.buildSearchParams(req.query);

    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }

    const userId = req.user?.userId;
    const items = await this.searchItemsInteractor.execute(
      result.params,
      userId,
    );

    const responseItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      inventoryStatus:
        item.inventory.amount > 0
          ? InventoryStatus.IN_STOCK
          : InventoryStatus.OUT_OF_STOCK,
      images: item.images,
      isFavorite: item.isFavorite ?? null,
      tags: item.tags,
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

    if (query.tagIds) {
      const parsedTagIds = parseJsonToNumberArray(query.tagIds);
      if (parsedTagIds === null) {
        return {
          success: false,
          error: 'tagIds must be an array of integers',
        };
      }
      if (parsedTagIds !== undefined) {
        params.tagIds = parsedTagIds;
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
