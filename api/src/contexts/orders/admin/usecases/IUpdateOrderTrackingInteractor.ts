export interface IUpdateOrderTrackingInteractor {
  execute(orderId: number, trackingNumber: string): Promise<void>;
}
