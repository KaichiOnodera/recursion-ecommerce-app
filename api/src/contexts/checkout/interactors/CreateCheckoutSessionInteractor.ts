import { ICreateCheckoutSessionInteractor } from '../usecases/ICreateCheckoutSessionInteractor';
import { ICartRepository } from '../../cart/domains/repositories/ICartRepository';
import { IItemRepository } from '../../items/domains/repositories/IItemRepository';
import { IUserRepository } from '../../users/domains/repositories/IUserRepository';
import { IStripeAdapter } from '../domains/adapters/IStripeAdapter';
import { CheckoutSessionMode } from '../domains/entities/CheckoutSession';

export class CreateCheckoutSessionInteractor
  implements ICreateCheckoutSessionInteractor
{
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly itemRepository: IItemRepository,
    private readonly userRepository: IUserRepository,
    private readonly stripeAdapter: IStripeAdapter,
  ) {}

  async execute(params: {
    userId: number;
  }): Promise<{ sessionId: string; url: string }> {
    const cart = await this.cartRepository.findByUserId(params.userId);
    if (!cart?.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const user = await this.userRepository.findById(params.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const successUrl =
      process.env.CHECKOUT_SUCCESS_URL ??
      'http://localhost:3000/order/complete';
    const cancelUrl =
      process.env.CHECKOUT_CANCEL_URL ?? 'http://localhost:3000/products';

    const lineItems = [];
    for (const cartItem of cart.items) {
      const item = await this.itemRepository.findById(cartItem.id);
      if (!item) {
        throw new Error(`Item with id ${cartItem.id} not found`);
      }

      // 在庫チェック
      if (item.inventory.amount < cartItem.amount) {
        throw new Error(
          `Insufficient inventory for item ${item.name}. Available: ${item.inventory.amount}, Requested: ${cartItem.amount}`,
        );
      }

      // Stripe用のlineItemsを作成
      lineItems.push({
        priceData: {
          currency: 'jpy',
          productData: {
            name: item.name,
            description: item.description,
          },
          unitAmount: item.price,
        },
        quantity: cartItem.amount,
      });
    }

    // Stripe Checkout Session作成
    const session = await this.stripeAdapter.createCheckoutSession({
      lineItems,
      mode: CheckoutSessionMode.Payment,
      successUrl,
      cancelUrl,
      customerEmail: user.email,
      metadata: {
        userId: params.userId.toString(),
        cartId: cart.id.toString(),
      },
    });

    return {
      sessionId: session.sessionId,
      url: session.checkoutUrl,
    };
  }
}
