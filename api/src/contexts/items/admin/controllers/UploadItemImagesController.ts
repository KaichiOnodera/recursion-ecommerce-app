import express from 'express';
import { IUploadItemImagesInteractor } from '../usecases/IUploadItemImagesInteractor';
import multer from 'multer';
import { PostRes } from '@shared/types/posts';

// multerの設定（メモリストレージを使用）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB（将来的に制限を追加する場合）
  },
});

export class UploadItemImagesController {
  constructor(
    private readonly uploadItemImagesInteractor: IUploadItemImagesInteractor,
  ) {}

  // multerミドルウェアを返す
  getMulterMiddleware() {
    return upload.array('images', 10); // 最大10ファイル
  }

  async execute(
    req: express.Request<{ id: string }>,
    res: express.Response<
      PostRes['/admin/items/:id/images'] | { message: string }
    >,
  ) {
    try {
      const itemId = parseInt(req.params.id);

      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }

      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const images = await this.uploadItemImagesInteractor.execute(
        itemId,
        files,
      );

      const responseImages = images.map((image) => ({
        id: image.id,
        itemId: image.itemId,
        src: image.src, // Interactorで既にURLに変換済み
        order: image.order,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      }));

      return res.status(201).json({ images: responseImages });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Item not found') {
          return res.status(404).json({ message: error.message });
        }
        if (
          error.message.includes('Maximum') ||
          error.message.includes('Unsupported')
        ) {
          return res.status(400).json({ message: error.message });
        }
      }

      console.error('Error uploading images:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
