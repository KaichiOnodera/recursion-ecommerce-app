import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetOrdersInteractor } from '../usecases/IGetOrdersInteractor';

export class GetOrdersController {
  constructor(private readonly getOrdersInteractor: IGetOrdersInteractor) {}

  async execute(
    _req: express.Request<null>,
    res: express.Response<GetRes['/admin/orders']>,
  ) {
    const orders = await this.getOrdersInteractor.execute();

    const responseOrders = orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      lastName: order.lastName,
      firstName: order.firstName,
      email: order.email,
      address: order.address,
      totalPrice: order.totalPrice,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        itemId: item.itemId,
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        amount: item.amount,
      })),
    }));

    res.status(200).json({ orders: responseOrders });
  }
}
