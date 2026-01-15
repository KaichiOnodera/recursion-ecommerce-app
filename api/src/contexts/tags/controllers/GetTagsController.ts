import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetTagsInteractor } from '../usecases/IGetTagsInteractor';

export class GetTagsController {
  constructor(private readonly getTagsInteractor: IGetTagsInteractor) {}

  async execute(req: express.Request, res: express.Response<GetRes['/tags']>) {
    try {
      const itemIdParam = req.query.itemId;
      const itemId =
        itemIdParam !== undefined
          ? parseInt(itemIdParam as string, 10)
          : undefined;

      if (itemIdParam !== undefined && (isNaN(itemId!) || itemId! < 1)) {
        return res.status(400).json({
          tags: [],
        });
      }

      const tags = await this.getTagsInteractor.execute(itemId);

      return res.status(200).json({
        tags: tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
        })),
      });
    } catch (error) {
      console.error('Error getting tags:', error);
      return res.status(500).json({ tags: [] });
    }
  }
}
