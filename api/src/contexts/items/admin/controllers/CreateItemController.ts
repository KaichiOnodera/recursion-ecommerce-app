import express from 'express';
import { PostReq, PostRes } from '@shared/types/posts';
import { ICreateItemInteractor } from '../usecases/ICreateItemInteractor';

export class CreateItemController {
  constructor(private readonly createItemInteractor: ICreateItemInteractor) {}

  async execute(
    req: express.Request<
      null,
      PostRes['admin/items'] | { message: string },
      PostReq['admin/items']
    >,
    res: express.Response<PostRes['admin/items'] | { message: string }>,
  ) {
    const { name, description, type } = req.body;

    if (!name || !description || type === undefined) {
      return res
        .status(400)
        .json({ message: 'Name, description, and type are required' });
    }

    const item = await this.createItemInteractor.execute(
      name,
      description,
      type,
    );

    const responseItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    res.status(201).json({ item: responseItem });
  }
}
