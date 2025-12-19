export interface ICreateCheckoutSessionInteractor {
  execute(params: { userId: number }): Promise<{
    sessionId: string;
    url: string;
  }>;
}
