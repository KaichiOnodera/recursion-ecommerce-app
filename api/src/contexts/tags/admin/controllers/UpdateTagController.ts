import express from 'express';
import { PatchRes } from '@shared/types/patches';
import { IUpdateTagInteractor } from '../../usecases/IUpdateTagInteractor';
import { AuthenticatedRequest } from '../../../../middlewares/verifyAccessToken';

export class UpdateTagController {
  constructor(private readonly updateTagInteractor: IUpdateTagInteractor) {}

  async execute(
    req: AuthenticatedRequest<{ name: string }, { id: string }>,
    res: express.Response<PatchRes['/admin/tags/:id'] | { message: string }>,
  ) {
    try {
      const tagId = parseInt(req.params.id);

      if (isNaN(tagId) || tagId < 1) {
        return res.status(400).json({ message: 'Invalid tag ID' });
      }

      const { name } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          message: 'Tag name is required',
        });
      }

      if (name.length > 50) {
        return res.status(400).json({
          message: 'Tag name must be 50 characters or less',
        });
      }

      const tag = await this.updateTagInteractor.execute(tagId, name.trim());

      if (!tag) {
        return res.status(404).json({ message: 'Tag not found' });
      }

      return res.status(200).json({
        tag: {
          id: tag.id,
          name: tag.name,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return res.status(409).json({ message: error.message });
        }
      }

      console.error('Error updating tag:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
