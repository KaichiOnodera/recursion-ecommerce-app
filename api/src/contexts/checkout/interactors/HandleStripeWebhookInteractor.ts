import { IHandleStripeWebhookInteractor } from '../usecases/IHandleStripeWebhookInteractor';
import { IOrderRepository } from '../../orders/domains/repositories/IOrderRepository';
import { IInventoryRepository } from '../../items/domains/repositories/IInventoryRepository';
import { IStripeAdapter } from '../domains/adapters/IStripeAdapter';
import { ICartRepository } from '../../cart/domains/repositories/ICartRepository';
import { ICartItemRepository } from '../../cart/domains/repositories/ICartItemRepository';
import { IItemRepository } from '../../items/domains/repositories/IItemRepository';
import { DisplayStatus } from '../../items/domains/entities/Item';
import { OrderStatus } from '@prisma/client';
import Stripe from 'stripe';

export class HandleStripeWebhookInteractor
  implements IHandleStripeWebhookInteractor
{
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly stripeAdapter: IStripeAdapter,
    private readonly cartRepository: ICartRepository,
    private readonly cartItemRepository: ICartItemRepository,
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentPaymentFailed(event);
        break;
      case 'product.created':
        await this.handleProductCreated(event);
        break;
      case 'product.deleted':
        await this.handleProductDeleted(event);
        break;
      default:
        // Unhandled event type
        break;
    }
  }

  // ここから、決済完了後の処理をします
  private async handleCheckoutSessionCompleted(
    event: Stripe.Event,
  ): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;

    // StripeセッションIDから注文を取得
    const order = await this.orderRepository.getByStripeSessionId(session.id);
    if (!order) {
      const errorMessage = `Order not found for session ID: ${session.id}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (order.orderStatus === OrderStatus.COMPLETED) {
      return;
    }

    // Stripe APIから詳細なsession情報を取得（shipping_detailsとcustomer_detailsを含む）
    const detailedSession = await this.stripeAdapter.retrieveCheckoutSession(
      session.id,
    );

    // ゲストユーザーのemailを更新（checkoutページで入力されたemail）
    if (detailedSession.customer_details?.email) {
      await this.orderRepository.updateEmail(
        order.id,
        detailedSession.customer_details.email,
      );
    } else if (detailedSession.customer_email) {
      // customer_detailsがない場合、customer_emailを確認
      await this.orderRepository.updateEmail(
        order.id,
        detailedSession.customer_email,
      );
    }

    // PaymentIDの保存
    if (detailedSession.payment_intent) {
      const paymentId =
        typeof detailedSession.payment_intent === 'string'
          ? detailedSession.payment_intent
          : detailedSession.payment_intent.id;
      await this.orderRepository.updatePaymentExternalIdBySessionId(
        session.id,
        paymentId,
      );
    }

    // 住所情報の更新（checkoutページで入力された住所）
    // shipping_details.addressまたはcustomer_details.addressから住所を取得
    let shippingAddress: Stripe.Address | null = null;

    // shipping_details.addressを確認（通常はここに含まれる）
    if (detailedSession.shipping_details?.address) {
      shippingAddress = detailedSession.shipping_details.address;
    }
    // customer_details.addressを確認（Stripeの設定によってはここに含まれる場合がある）
    else if (detailedSession.customer_details?.address) {
      shippingAddress = detailedSession.customer_details.address;
    }

    if (shippingAddress) {
      const address = this.formatShippingAddress(shippingAddress);
      await this.orderRepository.updateAddress(order.id, address);
    } else {
      // 物理商品があるのに住所が取得できない場合は警告
      console.warn(
        `Order ${order.id}: shipping address is not available. This may be expected for digital-only orders.`,
      );
    }

    // 注文ステータスの更新
    await this.orderRepository.updateStatus(order.id, OrderStatus.COMPLETED);

    // 在庫減算
    for (const orderItem of order.items) {
      // itemIdがnullの場合はスキップ（購入後、削除されている可能性があるため）
      if (!orderItem.itemId) {
        console.warn(
          `OrderItem ${orderItem.id} has no itemId. Skipping inventory update.`,
        );
        continue;
      }

      try {
        await this.inventoryRepository.decreaseStock(
          orderItem.itemId,
          orderItem.amount,
        );
      } catch (error) {
        // 在庫減算に失敗した場合でも、注文は既に完了しているため、
        // エラーをログに記録して処理を続行する
        console.error(
          `Failed to decrease inventory for itemId=${orderItem.itemId}, amount=${orderItem.amount}:`,
          error,
        );
      }
    }

    // metadataからcartIdを取得してカートをクリア
    const cartId = detailedSession.metadata?.cartId;
    if (cartId) {
      try {
        const cartIdNumber = parseInt(cartId, 10);
        await this.cartItemRepository.clearCart(cartIdNumber);
      } catch (error) {
        // カートのクリアに失敗しても、注文は既に完了しているため、ログを残す
        console.error(
          `Failed to clear cart ${cartId} after order ${order.id}:`,
          error,
        );
      }
    } else {
      console.warn(
        `Order ${order.id}: cartId not found in metadata. Cart may not be cleared.`,
      );
    }
  }

  // 決済失敗時
  private async handlePaymentIntentPaymentFailed(
    event: Stripe.Event,
  ): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    if (paymentIntent.metadata?.orderId) {
      const orderId = parseInt(paymentIntent.metadata.orderId, 10);

      await this.orderRepository.updateStatus(orderId, OrderStatus.CANCELLED);
    } else {
      // metadataにorderIdが含まれていない場合は、エラーをログに記録
      console.error(
        `Order ID not found in payment intent metadata: ${paymentIntent.id}`,
      );
    }
  }

  // Stripeの住所情報を文字列にフォーマット
  private formatShippingAddress(address: Stripe.Address): string {
    const parts: string[] = [];

    // 郵便番号
    if (address.postal_code) {
      parts.push(`〒${address.postal_code}`);
    }

    // 都道府県
    if (address.state) {
      parts.push(address.state);
    }

    // 市区町村
    if (address.city) {
      parts.push(address.city);
    }

    // 番地（line1）
    if (address.line1) {
      parts.push(address.line1);
    }

    // 建物名・部屋番号（line2）
    if (address.line2) {
      parts.push(address.line2);
    }

    return parts.join(' ');
  }

  // Stripe製品作成時の処理
  private async handleProductCreated(event: Stripe.Event): Promise<void> {
    const product = event.data.object as Stripe.Product;

    // 既に存在するか確認（冪等性のため）
    const existingItem = await this.itemRepository.findByStripeProductId(
      product.id,
    );
    if (existingItem) {
      return;
    }

    // 価格情報を取得
    let priceId: string | undefined = undefined;
    let priceAmount: number = 0;

    if (product.default_price) {
      // default_price が文字列（Price ID）の場合
      if (typeof product.default_price === 'string') {
        priceId = product.default_price;
      }
      // default_price が Price オブジェクトの場合（expandされた場合）
      else if (
        typeof product.default_price === 'object' &&
        'id' in product.default_price
      ) {
        priceId = product.default_price.id;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        priceAmount = product.default_price.unit_amount || 0;
      }

      // Price ID があるが、価格情報がない場合は Price オブジェクトを取得
      if (priceId && priceAmount === 0) {
        try {
          const price = await this.stripeAdapter.retrievePrice(priceId);
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          priceAmount = price.unit_amount || 0;
        } catch (error) {
          console.warn(`Failed to retrieve price ${priceId}:`, error);
          // 価格取得に失敗しても処理を続行（後でprice.createdイベントで更新される可能性がある）
        }
      }
    } else {
      // default_price が null の場合は、価格リストを取得
      try {
        const prices = await this.stripeAdapter.listPrices(product.id);
        const firstPrice = prices.data[0];
        if (firstPrice) {
          priceId = firstPrice.id;
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          priceAmount = firstPrice.unit_amount || 0;
        }
      } catch (error) {
        console.warn(`Failed to list prices for product ${product.id}:`, error);
        // 価格リスト取得に失敗しても処理を続行（後でprice.createdイベントで更新される可能性がある）
      }
    }

    // データベースに製品を作成
    try {
      const item = await this.itemRepository.create(
        product.name || 'Untitled Product',
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        product.description || '',
        1, // type: デフォルト値（物理商品）
      );

      // 価格を更新（JPYの場合は最小通貨単位なので、そのまま使用）
      await this.itemRepository.update(
        item.id,
        undefined, // name
        undefined, // description
        undefined, // type
        Math.floor(priceAmount), // price
        undefined, // inventoryAmount
        DisplayStatus.PRIVATE, // displayStatus: 下書きステータス
      );

      // stripeProductIdとstripePriceIdを保存
      await this.itemRepository.updateStripeIds(
        item.id,
        product.id, // Stripe製品のID（例: "prod_XXXXX"）
        priceId, // Stripe価格のID（例: "price_XXXXX"、nullの可能性あり）
      );
    } catch (error) {
      console.error(`Failed to create item for product ${product.id}:`, error);
      throw error;
    }
  }

  // Stripe製品削除時の処理
  private async handleProductDeleted(event: Stripe.Event): Promise<void> {
    const product = event.data.object as Stripe.Product;

    // stripeProductIdで製品を検索
    const item = await this.itemRepository.findByStripeProductId(product.id);
    if (!item) {
      return;
    }

    // データベースから削除
    await this.itemRepository.delete(item.id);
  }
}
