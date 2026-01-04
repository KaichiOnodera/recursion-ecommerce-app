import { IUploadItemImagesInteractor } from '../usecases/IUploadItemImagesInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { IItemImageRepository } from '../../domains/repositories/IItemImageRepository';
import { IImageStorageAdapter } from '../../domains/adapters/IImageStorageAdapter';
import { ItemImage } from '../../domains/entities/ItemImage';
import {
  isAllowedExtension,
  isAllowedMimeType,
} from '../../../../utils/imageUtils';
import * as path from 'path';
import * as crypto from 'crypto';

const MAX_IMAGES_PER_ITEM = 10;

export class UploadItemImagesInteractor implements IUploadItemImagesInteractor {
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly itemImageRepository: IItemImageRepository,
    private readonly imageStorageAdapter: IImageStorageAdapter,
  ) {}

  async execute(
    itemId: number,
    files: Express.Multer.File[],
  ): Promise<ItemImage[]> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    const currentCount = await this.itemImageRepository.countByItemId(itemId);

    if (currentCount + files.length > MAX_IMAGES_PER_ITEM) {
      throw new Error(
        `Maximum ${MAX_IMAGES_PER_ITEM} images allowed per item. Current: ${currentCount}, Trying to add: ${files.length}`,
      );
    }

    this.validateFiles(files);

    const maxOrder = await this.itemImageRepository.getMaxOrder(itemId);

    const uploadedImages: ItemImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const order = maxOrder + i + 1;

      const filename = this.generateFilename(itemId, file.originalname);

      const filePath = await this.imageStorageAdapter.save(
        file.buffer,
        filename,
        itemId,
      );

      const image = await this.itemImageRepository.create(
        itemId,
        filePath,
        order,
      );

      const imageUrl = this.imageStorageAdapter.getUrl(filePath, itemId);
      const imageWithUrl: ItemImage = {
        id: image.id,
        itemId: image.itemId,
        src: imageUrl,
        order: image.order,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      };

      uploadedImages.push(imageWithUrl);
    }

    return uploadedImages;
  }

  private validateFiles(files: Express.Multer.File[]): void {
    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!isAllowedExtension(ext)) {
        throw new Error(`Unsupported file extension: ${ext}`);
      }

      if (!isAllowedMimeType(file.mimetype)) {
        throw new Error(`Unsupported MIME type: ${file.mimetype}`);
      }
    }
  }

  private generateFilename(itemId: number, originalName: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    const ext = path.extname(originalName).toLowerCase();

    return `${itemId}_${timestamp}_${randomString}${ext}`;
  }
}
