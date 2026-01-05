import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetItemInteractor } from '../usecases/IGetItemInteractor';
import { InventoryStatus } from '@shared/schemas/item';

export class GetItemController {
  constructor(private readonly getItemInteractor: IGetItemInteractor) {}

  async execute(
    req: express.Request<{ id: string }>,
    res: express.Response<GetRes['/items/:id'] | { message: string }>,
  ) {
    const itemId = parseInt(req.params.id);

    if (isNaN(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    const item = await this.getItemInteractor.execute(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const inventoryStatus =
      item.inventory.amount > 0
        ? InventoryStatus.IN_STOCK
        : InventoryStatus.OUT_OF_STOCK;

    res.status(200).json({
      item: {
        id: item.id,
        name: item.name,
        description: item.description,
        type: item.type,
        price: item.price,
        inventoryStatus,
        images: item.images,
      },
    });
  }
}
