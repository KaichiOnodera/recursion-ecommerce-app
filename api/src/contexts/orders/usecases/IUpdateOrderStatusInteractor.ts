import { OrderStatus } from '@prisma/client';
import { Order } from '../domains/repositories/IOrderRepository';

export interface IUpdateOrderStatusInteractor {
  execute(id: number, status: OrderStatus): Promise<Order>;
}
