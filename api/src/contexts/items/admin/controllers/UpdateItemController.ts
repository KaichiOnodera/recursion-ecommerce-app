import express from 'express';
import { PatchRes } from '@shared/types/patches';
import { IUpdateItemInteractor } from '../usecases/IUpdateItemInteractor';
import { InventoryStatus } from '@shared/schemas/item';
import multer from 'multer';
import { parseJsonToNumberArray } from '../../../../utils/parseJson';
import { AuthenticatedRequest } from '../../../../middlewares/verifyAccessToken';

// multerの設定（メモリストレージを使用）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB（1ファイルあたりの最大サイズ）
  },
});

interface UpdateItemRequest extends AuthenticatedRequest<any, { id: string }> {
  files?: {
    images?: Express.Multer.File[];
  };
}

export class UpdateItemController {
  constructor(private readonly updateItemInteractor: IUpdateItemInteractor) {}

  // multerミドルウェアを返す
  getMulterMiddleware() {
    return upload.fields([
      { name: 'images', maxCount: 10 }, // 画像ファイル（最大10ファイル）
    ]);
  }

  async execute(
    req: UpdateItemRequest,
    res: express.Response<PatchRes['/admin/items/:id'] | { message: string }>,
  ) {
    try {
      const itemId = parseInt(req.params.id);

      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }

      const {
        name,
        description,
        type,
        price,
        inventoryAmount,
        displayStatus,
        imageIds,
      } = req.body;

      // 少なくとも1つのフィールドが更新されるか確認する
      if (
        name === undefined &&
        description === undefined &&
        type === undefined &&
        price === undefined &&
        inventoryAmount === undefined &&
        displayStatus === undefined &&
        imageIds === undefined
      ) {
        const hasFiles = req.files?.images && req.files.images.length > 0;

        if (!hasFiles) {
          return res.status(400).json({
            message: 'At least one field must be provided for update',
          });
        }
      }

      const files = req.files?.images;

      const parsedImageIds = parseJsonToNumberArray(imageIds);
      if (parsedImageIds === null) {
        return res.status(400).json({
          message: 'imageIds must be an array of integers',
        });
      }

      const result = await this.updateItemInteractor.execute(
        itemId,
        name,
        description,
        type !== undefined ? Number(type) : undefined,
        price !== undefined ? Number(price) : undefined,
        inventoryAmount !== undefined ? Number(inventoryAmount) : undefined,
        files,
        displayStatus as 'public' | 'private' | undefined,
        parsedImageIds,
      );

      if (!result) {
        return res.status(404).json({ message: 'Item not found' });
      }

      const responseImages = result.images.map((image) => ({
        id: image.id,
        itemId: image.itemId,
        src: image.src,
        order: image.order,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      }));

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
        displayStatus: result.item.displayStatus,
        images: responseImages,
        createdAt: result.item.createdAt,
        updatedAt: result.item.updatedAt,
      };

      return res.status(200).json({
        item: responseItem,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('Maximum') ||
          error.message.includes('Unsupported') ||
          error.message.includes('Invalid image ID')
        ) {
          return res.status(400).json({ message: error.message });
        }
      }

      console.error('Error updating item:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
