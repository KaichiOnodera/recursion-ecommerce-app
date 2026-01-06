import { Order } from '../../domains/entities/Order';

export interface IGetOrdersNeedingShippingInteractor {
  execute(): Promise<Order[]>;
}
