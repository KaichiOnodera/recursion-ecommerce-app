import {
  Order,
  CreateOrderData,
} from '../domains/repositories/IOrderRepository';

export interface ICreateOrderInteractor {
  execute(data: CreateOrderData): Promise<Order>;
}
