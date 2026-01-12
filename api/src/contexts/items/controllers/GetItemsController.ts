import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetItemsInteractor } from '../usecases/IGetItemsInteractor';
import { InventoryStatus } from '@shared/schemas/item';
import { AuthenticatedRequest } from '../../../middlewares';

export class GetItemsController {
  constructor(private readonly getItemsInteractor: IGetItemsInteractor) {}

  async execute(
    req: AuthenticatedRequest<Record<string, never>>,
    res: express.Response<GetRes['/items']>,
  ) {
    const userId = req.user?.userId;
    const items = await this.getItemsInteractor.execute(userId);

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
      isFavorite: item.isFavorite ?? null,
      tags: item.tags,
    }));

    res.status(201).json({ items: responseItems });
  }
}
