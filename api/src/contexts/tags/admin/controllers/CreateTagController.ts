import express from 'express';
import { PostRes } from '@shared/types/posts';
import { ICreateTagInteractor } from '../../usecases/ICreateTagInteractor';

export class CreateTagController {
  constructor(private readonly createTagInteractor: ICreateTagInteractor) {}

  async execute(
    req: express.Request,
    res: express.Response<PostRes['/admin/tags'] | { message: string }>,
  ) {
    try {
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

      const tag = await this.createTagInteractor.execute(name.trim());

      return res.status(201).json({
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

      console.error('Error creating tag:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
