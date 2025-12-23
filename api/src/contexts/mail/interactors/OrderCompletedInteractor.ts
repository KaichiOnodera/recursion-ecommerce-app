import { IOrderCompletedInteractor } from '../usecases/IOrderCompletedInteractor';
import { ICartRepository } from '../../cart/domains/repositories/ICartRepository';
import { IUserRepository } from '../../auth/domains/repositories/IUserRepository';
import { IEmailAdapter } from '../domains/adapters/IEmailAdapter';
import { ORDER_COMPLETED_TEMPLATE } from '../interactors/templates/OrderCompletedTemplate';

export class OrderCompletedInteractor implements IOrderCompletedInteractor {
  constructor(
    private readonly emailAdapter: IEmailAdapter,
    private readonly cartRepository: ICartRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async OrderCompleted(to: string, cartId: string): Promise<void> {
    const cart = await this.cartRepository.findById(Number(cartId));
    if (!cart) {
      throw new Error('Order not found');
    }

    // メールメッセージの作成
    const message = {
      to,
      ...ORDER_COMPLETED_TEMPLATE(cartId),
    };

    // メールの送信
    await this.emailAdapter.send(message);
  }
}
