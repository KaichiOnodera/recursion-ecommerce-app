import { ICartRepository } from '../../cart/domains/repositories/ICartRepository';
import { IOrderConfirmationInteractor } from '../usecases/IOrderConfrimationInteractor';
import { IUserRepository } from '../../auth/domains/repositories/IUserRepository';
import { IEmailAdapter } from '../domains/adapters/IEmailAdapter';
import { ORDER_CONFIRMATION_TEMPLATE } from './templates/OrderCofirmation';

export class OrderConfirmationInteractor
  implements IOrderConfirmationInteractor
{
  constructor(
    private readonly emailAdapter: IEmailAdapter,
    private readonly cartRepository: ICartRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async OrderConfirmation(to: string, cartId: string): Promise<void> {
    const cart = await this.cartRepository.find(Number(cartId));
    if (!cart) {
      throw new Error('Order not found');
    }

    // メールメッセージの作成
    const message = {
      to,
      ...ORDER_CONFIRMATION_TEMPLATE(cartId),
    };

    // メールの送信
    await this.emailAdapter.send(message);
  }
}
