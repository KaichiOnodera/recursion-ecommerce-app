export interface ICreateCheckoutSessionInteractor {
  execute(params: { userId?: number; sessionId?: string }): Promise<{
    sessionId: string;
    url: string;
  }>;
}
