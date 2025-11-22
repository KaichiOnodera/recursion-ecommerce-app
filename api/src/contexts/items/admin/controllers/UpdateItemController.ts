import express from 'express';
import { PatchReq, PatchRes } from '@shared/types/patches';
import { IUpdateItemInteractor } from '../usecases/IUpdateItemInteractor';

export class UpdateItemController {
  constructor(private readonly updateItemInteractor: IUpdateItemInteractor) {}

  async execute(
    req: express.Request<
      { id: string },
      PatchRes['admin/items/:id'] | { message: string },
      PatchReq['admin/items/:id']
    >,
    res: express.Response<PatchRes['admin/items/:id'] | { message: string }>,
  ) {
    const itemId = parseInt(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    const { name, description, type } = req.body;

    // 少なくとも1つのフィールドが更新されるか確認する
    if (name === undefined && description === undefined && type === undefined) {
      return res
        .status(400)
        .json({ message: 'At least one field must be provided for update' });
    }

    const item = await this.updateItemInteractor.execute(
      itemId,
      name,
      description,
      type,
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const responseItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    res.status(200).json({ item: responseItem });
  }
}
