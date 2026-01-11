export interface ISendDownloadTokenInteractor {
  execute(orderId: number): Promise<string>;
}
