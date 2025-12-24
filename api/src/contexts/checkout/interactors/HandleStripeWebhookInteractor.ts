import { IHandleStripeWebhookInteractor } from '../usecases/IHandleStripeWebhookInteractor';
import { IOrderRepository } from '../../orders/domains/repositories/IOrderRepository';
import { IInventoryRepository } from '../../items/domains/repositories/IInventoryRepository';
import { OrderStatus } from '@prisma/client';
import Stripe from 'stripe';

export class HandleStripeWebhookInteractor
  implements IHandleStripeWebhookInteractor
{
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly inventoryRepository: IInventoryRepository,
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
}
