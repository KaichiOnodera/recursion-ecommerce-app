import express from 'express';
import { PostRes } from '@shared/types/posts';
import { ICreateItemInteractor } from '../usecases/ICreateItemInteractor';
import { InventoryStatus } from '@shared/schemas/item';
import multer from 'multer';

// multerの設定（メモリストレージを使用）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB（1ファイルあたりの最大サイズ）
  },
});

interface CreateItemRequest extends express.Request {
  files?: {
    images?: Express.Multer.File[];
  };
}

export class CreateItemController {
  constructor(private readonly createItemInteractor: ICreateItemInteractor) {}

  // multerミドルウェアを返す
  getMulterMiddleware() {
    return upload.fields([
      { name: 'images', maxCount: 10 }, // 画像ファイル（最大10ファイル）
    ]);
  }

  async execute(
    req: express.Request,
    res: express.Response<PostRes['/admin/items'] | { message: string }>,
  ) {
    try {
      const { name, description, type, price } = req.body;

      if (!name || !description || type === undefined || price === undefined) {
        return res.status(400).json({
          message: 'Name, description, type, and price are required',
        });
      }

      const typedReq = req as CreateItemRequest;
      const files = typedReq.files?.images;

      const result = await this.createItemInteractor.execute(
        name,
        description,
        Number(type),
        Number(price),
        files,
      );

      const responseItem = {
        id: result.item.id,
        name: result.item.name,
        description: result.item.description,
        type: result.item.type,
        price: result.item.price,
        inventoryStatus:
          result.item.inventory.amount > 0
            ? InventoryStatus.IN_STOCK
            : InventoryStatus.OUT_OF_STOCK,
        createdAt: result.item.createdAt,
        updatedAt: result.item.updatedAt,
      };

      const responseImages = result.images.map((image) => ({
        id: image.id,
        itemId: image.itemId,
        src: image.src,
        order: image.order,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      }));

      return res.status(201).json({
        item: responseItem,
        images: responseImages,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('Maximum') ||
          error.message.includes('Unsupported')
        ) {
          return res.status(400).json({ message: error.message });
        }
      }

      console.error('Error creating item:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
