import { ICartRepository } from '../../cart/domains/repositories/ICartRepository';
import { IOrderConfirmationInteractor } from '../usecases/IOrderConfrimationInteractor';
import { IUserRepository } from '../../auth/domains/repositories/IUserRepository';
import { IEmailAdapter } from '../domains/adapters/IEmailAdapter';

export class OrderConfirmationInteractor
  implements IOrderConfirmationInteractor
{
  constructor(
    private readonly emailAdapter: IEmailAdapter,
    private readonly cartRepository: ICartRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async OrderConfirmation(to: string, cartId: string): Promise<void> {
    // 注文情報の取得（必要に応じてcartInteractorを使用）
    const cart = await this.cartRepository.find(Number(cartId));
    if (!cart) {
      throw new Error('Order not found');
    }

    // メールメッセージの作成
    const message = {
      to,
      subject: 'Order Confirmation',
      text: `Your order with ID ${cartId} has been confirmed.`,
      html: `<p>Your order with ID <strong>${cartId}</strong> has been confirmed.</p>`,
    };

    // メールの送信
    await this.emailAdapter.send(message);
  }
}
