import express from 'express';
import { IGetItemImageInteractor } from '../usecases/IGetItemImageInteractor';
import { AuthenticatedRequest } from '../../../middlewares';

export class GetItemImageController {
  constructor(
    private readonly getItemImageInteractor: IGetItemImageInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<null, { itemId: string; filename: string }>,
    res: express.Response,
  ) {
    try {
      const itemId = parseInt(req.params.itemId);
      const { filename } = req.params;

      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }

      if (!filename) {
        return res.status(400).json({ message: 'Filename is required' });
      }

      // 管理者かどうかを判定
      const isAdmin = req.user?.role === 'ADMIN';

      // 画像を取得
      const result = await this.getItemImageInteractor.execute(
        itemId,
        filename,
        isAdmin,
      );

      if (!result) {
        return res.status(404).json({ message: 'Image not found' });
      }

      // 適切なヘッダーを設定
      res.setHeader('Content-Type', result.mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1年間キャッシュ

      // 画像をバイナリで返す
      return res.status(200).send(result.buffer);
    } catch (error) {
      console.error('Error getting item image:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
