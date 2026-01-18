import { ICreateItemInteractor } from '../usecases/ICreateItemInteractor';
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

export class CreateItemInteractor implements ICreateItemInteractor {
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly itemImageRepository: IItemImageRepository,
    private readonly imageStorageAdapter: IImageStorageAdapter,
    private readonly tagRepository?: ITagRepository,
  ) {}

  async execute(
    name: string,
    description: string,
    type: number,
    price: number,
    files?: Express.Multer.File[],
    displayStatus?: DisplayStatus,
    tagIds?: number[],
  ): Promise<{ item: Item; images: ItemImage[] }> {
    // 商品を作成
    const item = await this.itemRepository.create(name, description, type);

    // 価格とdisplayStatusを設定（商品作成後に更新）
    // displayStatusが指定されていない場合はデフォルトでPRIVATE
    const finalDisplayStatus = displayStatus ?? DisplayStatus.PRIVATE;
    const needsUpdate = price !== undefined || displayStatus !== undefined;
    if (needsUpdate) {
      await this.itemRepository.update(
        item.id,
        undefined,
        undefined,
        undefined,
        price,
        undefined,
        finalDisplayStatus,
      );
      // 更新後の商品を取得（管理者向けなのでお気に入り情報は不要）
      const updatedItem = await this.itemRepository.findById(
        item.id,
        undefined,
        undefined,
      );
      if (updatedItem) {
        Object.assign(item, updatedItem);
      }
    }

    if (tagIds && tagIds.length > 0 && this.tagRepository) {
      await this.tagRepository.replaceItemTags(item.id, tagIds);
    }

    const images: ItemImage[] = [];

    // 画像が指定されている場合、アップロード処理
    if (files && files.length > 0) {
      // 最大枚数チェック
      if (files.length > MAX_IMAGES_PER_ITEM) {
        throw new Error(
          `Maximum ${MAX_IMAGES_PER_ITEM} images allowed per item. Trying to add: ${files.length}`,
        );
      }

      // ファイル検証
      this.validateFiles(files);

      // 画像をアップロード
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const order = i + 1; // 新規作成時は1から開始

        // ファイル名を生成
        const filename = this.generateFilename(item.id, file.originalname);

        // 画像を保存
        const filePath = await this.imageStorageAdapter.save(
          file.buffer,
          filename,
          item.id,
        );

        // データベースにレコードを作成
        const image = await this.itemImageRepository.create(
          item.id,
          filePath,
          order,
        );

        // URLを取得してレスポンス用のデータを作成
        const imageUrl = this.imageStorageAdapter.getUrl(filePath, item.id);
        const imageWithUrl: ItemImage = {
          id: image.id,
          itemId: image.itemId,
          src: imageUrl,
          order: image.order,
          createdAt: image.createdAt,
          updatedAt: image.updatedAt,
        };

        images.push(imageWithUrl);
      }
    }

    return { item, images };
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
