import { OrderItemFile } from '../domains/entities/OrderItemFile';

export interface ICreateOrderItemFileInteractor {
  createByitemId(orderId: number, itemId: number): Promise<OrderItemFile>;
  createByOrderId(orderId: number): Promise<OrderItemFile[]>;
}
