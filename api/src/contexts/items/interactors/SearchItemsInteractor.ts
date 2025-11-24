import {
  ISearchItemsInteractor,
  SearchItemsParams,
} from '../usecases/ISearchItemsInteractor';
import { IItemRepository } from '../domains/repositories/IItemRepository';
import { ItemQuery } from '../domains/repositories/ItemQuery';
import { Item } from '../domains/entities/Item';

export class SearchItemsInteractor implements ISearchItemsInteractor {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(params: SearchItemsParams): Promise<Item[]> {
    const query = this.buildQuery(params);
    return await this.itemRepository.find(query);
  }

  private buildQuery(params: SearchItemsParams): ItemQuery {
    const { q, sort = 'newest', page = 1 } = params;
    const itemsPerPage = 20;
    const skip = (page - 1) * itemsPerPage;

    const query: ItemQuery = {
      where: {
        displayStatus: { not: 'private' },
      },
    };

    // 検索条件
    if (q) {
      query.where = {
        ...query.where,
        name: { contains: q },
      };
    }

    // ソート条件
    switch (sort) {
      case 'newest':
        query.orderBy = { createdAt: 'desc' };
        break;
      case 'price_asc':
        query.orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        query.orderBy = { price: 'desc' };
        break;
      case 'name_asc':
        query.orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        query.orderBy = { name: 'desc' };
        break;
      default:
        query.orderBy = { createdAt: 'desc' };
    }

    // ページネーション
    query.skip = skip;
    query.take = itemsPerPage;

    return query;
  }
}
