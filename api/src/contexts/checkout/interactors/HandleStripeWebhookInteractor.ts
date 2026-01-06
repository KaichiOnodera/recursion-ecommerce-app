import { IHandleStripeWebhookInteractor } from '../usecases/IHandleStripeWebhookInteractor';
import { IOrderRepository } from '../../orders/domains/repositories/IOrderRepository';
import { IInventoryRepository } from '../../items/domains/repositories/IInventoryRepository';
import { IStripeAdapter } from '../domains/adapters/IStripeAdapter';
import { ICartRepository } from '../../cart/domains/repositories/ICartRepository';
import { ICartItemRepository } from '../../cart/domains/repositories/ICartItemRepository';
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
  ) {}

  async execute(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentPaymentFailed(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
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
      console.log(
        `Order ${order.id} is already completed. Skipping duplicate webhook.`,
      );
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
      console.log(
        `Order ${order.id} email updated: ${detailedSession.customer_details.email}`,
      );
    } else if (detailedSession.customer_email) {
      // customer_detailsがない場合、customer_emailを確認
      await this.orderRepository.updateEmail(
        order.id,
        detailedSession.customer_email,
      );
      console.log(
        `Order ${order.id} email updated: ${detailedSession.customer_email}`,
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
      console.log(`Payment ID ${paymentId} saved for session ${session.id}`);
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
      console.log(`Order ${order.id} address updated: ${address}`);
    } else {
      // 物理商品があるのに住所が取得できない場合は警告
      console.warn(
        `Order ${order.id}: shipping address is not available. This may be expected for digital-only orders.`,
      );
    }

    // 注文ステータスの更新
    await this.orderRepository.updateStatus(order.id, OrderStatus.COMPLETED);
    console.log(`Order ${order.id} status updated to COMPLETED`);

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
        console.log(
          `Inventory decreased: itemId=${orderItem.itemId}, amount=${orderItem.amount}`,
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
        console.log(`Cart ${cartIdNumber} cleared after order ${order.id}`);
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

    console.log(
      `Successfully processed checkout.session.completed for order ${order.id}`,
    );
  }

  // 決済失敗時
  private async handlePaymentIntentPaymentFailed(
    event: Stripe.Event,
  ): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    if (paymentIntent.metadata?.orderId) {
      const orderId = parseInt(paymentIntent.metadata.orderId, 10);

      await this.orderRepository.updateStatus(orderId, OrderStatus.CANCELLED);
      console.log(
        `Order ${orderId} status updated to CANCELLED (payment failed)`,
      );
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
}
