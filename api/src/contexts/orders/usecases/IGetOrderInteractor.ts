import { Order } from '../domains/repositories/IOrderRepository';

export interface IGetOrderInteractor {
  getByStripeSessionId(sessionId: string): Promise<Order | null>;
}
