import { OrderItemFile } from '../entities/OrderItemFile';

export interface IOrderItemFileRepository {
  findById(id: number): Promise<OrderItemFile>;
  findByOrderId(orderId: number): Promise<OrderItemFile[]>;
  create(orderId: number, itemId: number): Promise<OrderItemFile>;
}
