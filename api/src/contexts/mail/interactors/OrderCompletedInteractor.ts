import { IOrderCompletedInteractor } from '../usecases/IOrderCompletedInteractor';
import { IOrderRepository } from 'src/contexts/orders/domains/repositories/IOrderRepository';
import { IUserRepository } from '../../auth/domains/repositories/IUserRepository';
import { IEmailAdapter } from '../domains/adapters/IEmailAdapter';
import { ORDER_COMPLETED_TEMPLATE } from '../interactors/templates/OrderCompletedTemplate';

export class OrderCompletedInteractor implements IOrderCompletedInteractor {
  constructor(
    private readonly emailAdapter: IEmailAdapter,
    private readonly orderRepository: IOrderRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async OrderCompleted(to: string, orderId: string): Promise<void> {
    const order = await this.orderRepository.getById(Number(orderId));
    if (order === null) {
      throw new Error('Order not found');
    }

    const user = await this.userRepository.findById(Number(order.userId));

    if (!user) {
      throw new Error('User not found');
    }

    // メールメッセージの作成
    const message = {
      to,
      ...ORDER_COMPLETED_TEMPLATE(orderId),
    };

    // メールの送信
    await this.emailAdapter.send(message);
  }
}
