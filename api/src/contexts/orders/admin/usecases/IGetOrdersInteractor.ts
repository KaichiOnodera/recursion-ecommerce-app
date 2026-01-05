import { Order } from '../../domains/entities/Order';

export interface IGetOrdersInteractor {
  execute(): Promise<Order[]>;
}
