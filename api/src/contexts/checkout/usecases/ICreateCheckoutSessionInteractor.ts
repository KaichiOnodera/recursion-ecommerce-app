export interface ICreateCheckoutSessionInteractor {
  execute(params: {
    userId: number;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{
    sessionId: string;
    url: string;
  }>;
}
