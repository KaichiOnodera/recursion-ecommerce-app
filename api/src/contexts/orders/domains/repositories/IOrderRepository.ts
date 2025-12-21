import { Order } from '../entities/Order';

export interface IOrderRepository {
  findByUserId(userId: number): Promise<Order[]>;
}
