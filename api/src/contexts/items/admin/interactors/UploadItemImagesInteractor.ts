import { IUploadItemImagesInteractor } from '../usecases/IUploadItemImagesInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { IItemImageRepository } from '../../domains/repositories/IItemImageRepository';
import { IImageStorageAdapter } from '../../domains/adapters/IImageStorageAdapter';
import { ItemImage } from '../../domains/entities/ItemImage';
import * as path from 'path';
import * as crypto from 'crypto';

const MAX_IMAGES_PER_ITEM = 10;
const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
];
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
];

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
    // 商品の存在確認
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    // 現在の画像枚数を取得
    const currentCount = await this.itemImageRepository.countByItemId(itemId);

    // 最大枚数チェック
    if (currentCount + files.length > MAX_IMAGES_PER_ITEM) {
      throw new Error(
        `Maximum ${MAX_IMAGES_PER_ITEM} images allowed per item. Current: ${currentCount}, Trying to add: ${files.length}`,
      );
    }

    // ファイル検証
    this.validateFiles(files);

    // 現在の最大orderを取得
    const maxOrder = await this.itemImageRepository.getMaxOrder(itemId);

    // 画像をアップロード
    const uploadedImages: ItemImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const order = maxOrder + i + 1;

      // ファイル名を生成
      const filename = this.generateFilename(itemId, file.originalname);

      // 画像を保存
      const filePath = await this.imageStorageAdapter.save(
        file.buffer,
        filename,
        itemId,
      );

      // データベースにレコードを作成
      const image = await this.itemImageRepository.create(
        itemId,
        filePath,
        order,
      );

      // URLを取得してレスポンス用のデータを作成
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
      // 拡張子の検証
      const ext = path.extname(file.originalname).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new Error(`Unsupported file extension: ${ext}`);
      }

      // MIMEタイプの検証
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new Error(`Unsupported MIME type: ${file.mimetype}`);
      }

      // ファイルサイズのチェック（オプション、現時点では制限なし）
      // 将来的に制限を追加する場合はここでチェック
    }
  }

  private generateFilename(itemId: number, originalName: string): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    const ext = path.extname(originalName).toLowerCase();

    return `${itemId}_${timestamp}_${randomString}${ext}`;
  }
}
