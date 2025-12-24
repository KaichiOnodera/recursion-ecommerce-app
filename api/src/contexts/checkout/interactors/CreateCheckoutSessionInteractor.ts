import { ICreateCheckoutSessionInteractor } from '../usecases/ICreateCheckoutSessionInteractor';
import { ICartRepository } from '../../cart/domains/repositories/ICartRepository';
import { IItemRepository } from '../../items/domains/repositories/IItemRepository';
import { IUserRepository } from '../../users/domains/repositories/IUserRepository';
import { IStripeAdapter } from '../domains/adapters/IStripeAdapter';
import { IOrderRepository } from '../../orders/domains/repositories/IOrderRepository';
import { CheckoutSessionMode } from '../domains/entities/CheckoutSession';
import { OrderStatus } from '@prisma/client';

export class CreateCheckoutSessionInteractor
  implements ICreateCheckoutSessionInteractor
{
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly itemRepository: IItemRepository,
    private readonly userRepository: IUserRepository,
    private readonly stripeAdapter: IStripeAdapter,
    private readonly orderRepository: IOrderRepository,
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
    let hasPhysicalProduct = false;
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.amount,
      0,
    );

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

      // 物理商品かチェック
      if (item.type === 1) {
        hasPhysicalProduct = true;
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

    // Orderの作成
    const order = await this.orderRepository.create({
      userId: params.userId,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      address: '', // 後でWebhookで更新: checkoutページでアドレスを入力する
      totalPrice,
      orderStatus: OrderStatus.PENDING,
      orderItems: cart.items.map((cartItem) => ({
        itemId: cartItem.id,
        itemName: cartItem.name,
        itemPrice: cartItem.price,
        amount: cartItem.amount,
      })),
    });

    // Stripe Checkout Session作成
    const session = await this.stripeAdapter.createCheckoutSession({
      lineItems,
      mode: CheckoutSessionMode.Payment,
      successUrl,
      cancelUrl,
      customerEmail: user.email, // ログインユーザーのメールアドレスを設定
      requireShippingAddress: hasPhysicalProduct, // 物理商品がある場合のみ住所入力を必須にする
      metadata: {
        userId: params.userId.toString(),
        cartId: cart.id.toString(),
        orderId: order.id.toString(),
      },
    });

    // StripeセッションIDを保存
    await this.orderRepository.createPaymentExternalId({
      orderId: order.id,
      provider: 'STRIPE',
      paymentSessionId: session.sessionId,
    });

    return {
      sessionId: session.sessionId,
      url: session.checkoutUrl,
    };
  }
}
