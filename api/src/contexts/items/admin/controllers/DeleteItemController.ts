import express from 'express';
import { DeleteReq, DeleteRes } from '@shared/types/delete';
import { IDeleteItemInteractor } from '../usecases/IDeleteItemInteractor';

export class DeleteItemController {
  constructor(private readonly deleteItemInteractor: IDeleteItemInteractor) {}

  async execute(
    req: express.Request<
      { id: string },
      DeleteRes['admin/items/:id'] | { message: string },
      DeleteReq['admin/items/:id']
    >,
    res: express.Response<DeleteRes['admin/items/:id'] | { message: string }>,
  ) {
    const itemId = parseInt(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    const item = await this.deleteItemInteractor.execute(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const responseItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    res.status(200).json({ item: responseItem });
  }
}
