export interface IOrderCompletedInteractor {
  OrderCompleted(orderId: number): Promise<void>;
}
