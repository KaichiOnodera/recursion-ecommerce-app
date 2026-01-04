import { IGetItemImageInteractor } from '../usecases/IGetItemImageInteractor';
import { IItemRepository } from '../domains/repositories/IItemRepository';
import { IItemImageRepository } from '../domains/repositories/IItemImageRepository';
import { IImageStorageAdapter } from '../domains/adapters/IImageStorageAdapter';
import { DisplayStatus } from '../domains/entities/Item';
import { getMimeTypeFromFilename } from '../../../utils/imageUtils';
import * as path from 'path';

export class GetItemImageInteractor implements IGetItemImageInteractor {
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly itemImageRepository: IItemImageRepository,
    private readonly imageStorageAdapter: IImageStorageAdapter,
  ) {}

  async execute(
    itemId: number,
    filename: string,
    isAdmin: boolean,
  ): Promise<{ buffer: Buffer; mimeType: string } | null> {
    // 商品の存在確認とdisplayStatusの取得
    const item = await this.itemRepository.findById(itemId);

    if (!item) {
      return null;
    }

    // プライベート商品の場合、管理者のみアクセス可能
    if (item.displayStatus === DisplayStatus.PRIVATE && !isAdmin) {
      return null;
    }

    // 画像レコードの取得
    const images = await this.itemImageRepository.findByItemId(itemId);
    const image = images.find((img) => {
      // srcからfilenameを抽出して比較
      const imageFilename = path.basename(img.src);
      return imageFilename === filename;
    });

    if (!image) {
      return null;
    }

    // 画像ファイルの取得
    const buffer = await this.imageStorageAdapter.getFile(image.src, itemId);

    // MIMEタイプの判定
    const mimeType = getMimeTypeFromFilename(filename);

    return { buffer, mimeType };
  }
}
