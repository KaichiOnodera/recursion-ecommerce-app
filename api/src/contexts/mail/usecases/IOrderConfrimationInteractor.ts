export interface IOrderConfirmationInteractor {
  OrderConfirmation(to: string, orderId: number): Promise<void>;
}
