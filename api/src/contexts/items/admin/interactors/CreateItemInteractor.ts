import { ICreateItemInteractor } from '../usecases/ICreateItemInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { Item } from '../../domains/entities/Item';

export class CreateItemInteractor implements ICreateItemInteractor {
  constructor(private readonly itemRepository: IItemRepository) {}

  async execute(
    name: string,
    description: string,
    type: number,
  ): Promise<Item> {
    return await this.itemRepository.create(name, description, type);
  }
}
