import { ItemImage } from '../../domains/entities/ItemImage';

export interface IUploadItemImagesInteractor {
  execute(itemId: number, files: Express.Multer.File[]): Promise<ItemImage[]>;
}
