import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetItemsInteractor } from '../../usecases/IGetItemsInteractor';
import { InventoryStatus } from '@shared/schemas/item';

export class GetItemsController {
  constructor(private readonly getItemsInteractor: IGetItemsInteractor) {}

  async execute(
    _req: express.Request<null>,
    res: express.Response<GetRes['/admin/items']>,
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
      displayStatus: item.displayStatus,
      images: item.images.map((image) => ({
        id: image.id,
        itemId: image.itemId,
        src: image.src,
        order: image.order,
        createdAt: image.createdAt,
        updatedAt: image.updatedAt,
      })),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      tags: item.tags,
    }));

    res.status(200).json({ items: responseItems });
  }
}
