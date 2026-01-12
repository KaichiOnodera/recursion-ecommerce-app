import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetTagUsageCountInteractor } from '../usecases/IGetTagUsageCountInteractor';

export class GetTagUsageCountController {
  constructor(
    private readonly getTagUsageCountInteractor: IGetTagUsageCountInteractor,
  ) {}

  async execute(
    req: express.Request<{ id: string }>,
    res: express.Response<
      GetRes['/admin/tags/:id/usage-count'] | { message: string }
    >,
  ) {
    try {
      const tagId = parseInt(req.params.id, 10);

      if (isNaN(tagId) || tagId < 1) {
        return res.status(400).json({ message: 'Invalid tag ID' });
      }

      const count = await this.getTagUsageCountInteractor.execute(tagId);

      return res.status(200).json({
        count,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Tag not found') {
        return res.status(404).json({ message: 'Tag not found' });
      }

      console.error('Error getting tag usage count:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
