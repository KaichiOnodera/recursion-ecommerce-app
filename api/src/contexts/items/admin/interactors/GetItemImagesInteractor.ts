import { IGetItemImagesInteractor } from '../usecases/IGetItemImagesInteractor';
import { IItemImageRepository } from '../../domains/repositories/IItemImageRepository';
import { ItemImage } from '../../domains/entities/ItemImage';

export class GetItemImagesInteractor implements IGetItemImagesInteractor {
  constructor(private readonly itemimageRepository: IItemImageRepository) {}

  async execute( itemId: number ): Promise<ItemImage[]> {

    return await this.itemimageRepository.findbyItemId( itemId );
    
  }
}