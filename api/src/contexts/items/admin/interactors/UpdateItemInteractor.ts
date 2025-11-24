import { IUpdateItemInteractor } from '../usecases/IUpdateItemInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { Item } from '../../domains/entities/Item';

export class UpdateItemInteractor implements IUpdateItemInteractor {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(
    id: number,
    name?: string,
    description?: string,
    type?: number,
  ): Promise<Item | null> {
    return await this.itemRepository.update(id, name, description, type);
  }
}
