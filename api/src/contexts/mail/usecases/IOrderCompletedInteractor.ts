export interface IOrderCompletedInteractor {
  OrderCompleted(orderId: string): Promise<void>;
}
