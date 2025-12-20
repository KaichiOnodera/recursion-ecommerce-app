export interface IOrderConfirmationInteractor {
  OrderConfirmation(to: string, orderId: string): Promise<void>;
}
