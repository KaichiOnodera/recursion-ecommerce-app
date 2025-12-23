export interface IOrderCompletedInteractor {
  OrderCompleted(to: string, orderId: string): Promise<void>;
}
