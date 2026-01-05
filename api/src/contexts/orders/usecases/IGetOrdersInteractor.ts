import { Order } from '../domains/entities/Order';

export interface IGetOrdersInteractor {
  execute(userId: number): Promise<Order[]>;
}
