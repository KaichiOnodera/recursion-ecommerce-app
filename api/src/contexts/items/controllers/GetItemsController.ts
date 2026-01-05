import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetItemsInteractor } from '../usecases/IGetItemsInteractor';
import { InventoryStatus } from '@shared/schemas/item';

export class GetItemsController {
  constructor(private readonly getItemsInteractor: IGetItemsInteractor) {}

  async execute(
    _req: express.Request<null>,
    res: express.Response<GetRes['/items']>,
  ) {
    const items = await this.getItemsInteractor.execute();

    const responseItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      inventoryStatus:
        item.inventory.amount > 0
          ? InventoryStatus.IN_STOCK
          : InventoryStatus.OUT_OF_STOCK,
      images: item.images,
    }));

    res.status(201).json({ items: responseItems });
  }
}
