import { IUpdateItemInteractor } from '../usecases/IUpdateItemInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { IItemImageRepository } from '../../domains/repositories/IItemImageRepository';
import { IImageStorageAdapter } from '../../domains/adapters/IImageStorageAdapter';
import { ITagRepository } from '../../../tags/domains/repositories/ITagRepository';
import { Item, DisplayStatus } from '../../domains/entities/Item';
import { ItemImage } from '../../domains/entities/ItemImage';
import {
  isAllowedExtension,
  isAllowedMimeType,
} from '../../../../utils/imageUtils';
import * as path from 'path';
import * as crypto from 'crypto';

const MAX_IMAGES_PER_ITEM = 10;

export class UpdateItemInteractor implements IUpdateItemInteractor {
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly itemImageRepository: IItemImageRepository,
    private readonly imageStorageAdapter: IImageStorageAdapter,
    private readonly tagRepository?: ITagRepository,
  ) {}

  async execute(
    id: number,
    name?: string,
    description?: string,
    type?: number,
    price?: number,
    inventoryAmount?: number,
    files?: Express.Multer.File[],
    displayStatus?: DisplayStatus,
    imageIds?: number[],
    tagIds?: number[],
  ): Promise<{ item: Item; images: ItemImage[] } | null> {
    // 商品の存在確認（管理者向けなのでお気に入り情報は不要）
    const item = await this.itemRepository.findById(id, undefined, undefined);
    if (!item) {
      return null;
    }

    // 商品情報を更新
    const updatedItem = await this.itemRepository.update(
      id,
      name,
      description,
      type,
      price,
      inventoryAmount,
      displayStatus,
    );

    if (!updatedItem) {
      return null;
    }

    if (tagIds !== undefined && this.tagRepository) {
      await this.tagRepository.replaceItemTags(id, tagIds);
    }

    if (imageIds !== undefined) {
      const existingImages = await this.itemImageRepository.findByItemId(id);
      const imageIdSet = new Set(imageIds);
      const imagesToDelete = existingImages.filter(
        (image) => !imageIdSet.has(image.id),
      );

      for (const imageToDelete of imagesToDelete) {
        try {
          await this.imageStorageAdapter.delete(imageToDelete.src, id);
        } catch {
          // ストレージ削除に失敗してもエラーにしない（S3の場合、既に削除されている可能性があるため）
        }
        await this.itemImageRepository.delete(imageToDelete.id);
      }

      for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        const newOrder = i + 1;

        const image = existingImages.find((img) => img.id === imageId);
        if (!image) {
          throw new Error(
            `Image with ID ${imageId} not found or does not belong to this item`,
          );
        }

        if (image.order !== newOrder) {
          await this.itemImageRepository.updateOrder(imageId, newOrder);
        }
      }
    }

    const uploadedImages: ItemImage[] = [];

    // 画像が指定されている場合、アップロード処理
    if (files && files.length > 0) {
      // 現在の画像枚数を取得
      const currentCount = await this.itemImageRepository.countByItemId(id);

      // 最大枚数チェック
      if (currentCount + files.length > MAX_IMAGES_PER_ITEM) {
        throw new Error(
          `Maximum ${MAX_IMAGES_PER_ITEM} images allowed per item. Current: ${currentCount}, Trying to add: ${files.length}`,
        );
      }

      // ファイル検証
      this.validateFiles(files);

      // 現在の最大orderを取得
      const maxOrder = await this.itemImageRepository.getMaxOrder(id);

      // 画像をアップロード
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 既存画像がない場合は1から開始、ある場合はmaxOrder + 1から開始
        const order = maxOrder === 0 ? i + 1 : maxOrder + i + 1;

        // ファイル名を生成
        const filename = this.generateFilename(id, file.originalname);

        // 画像を保存
        const filePath = await this.imageStorageAdapter.save(
          file.buffer,
          filename,
          id,
        );

        // データベースにレコードを作成
        const image = await this.itemImageRepository.create(
          id,
          filePath,
          order,
        );

        // URLを取得してレスポンス用のデータを作成
        const imageUrl = this.imageStorageAdapter.getUrl(filePath, id);
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
    }

    return { item: updatedItem, images: uploadedImages };
  }

  private validateFiles(files: Express.Multer.File[]): void {
    for (const file of files) {
      // 拡張子の検証
      const ext = path.extname(file.originalname).toLowerCase();
      if (!isAllowedExtension(ext)) {
        throw new Error(`Unsupported file extension: ${ext}`);
      }

      // MIMEタイプの検証
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
