import express from 'express';
import { GetRes } from '@shared/types/gets';
import { IGetOrdersInteractor } from '../usecases/IGetOrdersInteractor';
import { AuthenticatedRequest } from '../../../middlewares/verifyAccessToken';

export class GetOrdersController {
  constructor(private readonly getOrdersInteractor: IGetOrdersInteractor) {}

  async execute(
    req: AuthenticatedRequest,
    res: express.Response<GetRes['/orders'] | { message: string }>,
  ) {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const orders = await this.getOrdersInteractor.execute(req.user.userId);

    const responseOrders = orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      lastName: order.lastName,
      firstName: order.firstName,
      email: order.email,
      address: order.address,
      totalPrice: order.totalPrice,
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber,
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
