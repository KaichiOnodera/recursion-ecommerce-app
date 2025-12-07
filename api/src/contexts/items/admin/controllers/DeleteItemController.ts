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

    const result = await this.deleteItemInteractor.execute(itemId);

    res.status(200).json({ deleted: result });
  }
}
