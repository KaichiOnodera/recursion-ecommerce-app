import express from 'express';
import { DeleteRes } from '@shared/types/delete';
import { IDeleteTagInteractor } from '../usecases/IDeleteTagInteractor';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccessToken';

export class DeleteTagController {
  constructor(private readonly deleteTagInteractor: IDeleteTagInteractor) {}

  async execute(
    req: AuthenticatedRequest<Record<string, never>, { id: string }>,
    res: express.Response<DeleteRes['/admin/tags/:id'] | { message: string }>,
  ) {
    try {
      const tagId = parseInt(req.params.id);

      if (isNaN(tagId) || tagId < 1) {
        return res.status(400).json({ message: 'Invalid tag ID' });
      }

      const success = await this.deleteTagInteractor.execute(tagId);

      if (!success) {
        return res.status(404).json({ message: 'Tag not found' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting tag:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
