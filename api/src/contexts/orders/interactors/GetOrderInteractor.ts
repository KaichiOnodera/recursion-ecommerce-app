import { IGetOrderInteractor } from '../usecases/IGetOrderInteractor';
import { IOrderRepository } from '../domains/repositories/IOrderRepository';

export class GetOrderInteractor implements IGetOrderInteractor {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async getByStripeSessionId(sessionId: string) {
    return await this.orderRepository.getByStripeSessionId(sessionId);
  }
}
