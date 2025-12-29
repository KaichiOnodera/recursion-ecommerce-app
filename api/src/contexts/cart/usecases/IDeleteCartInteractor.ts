export interface IDeleteCartInteractor {
  execute(userId?: number, sessionId?: string): Promise<void>;
}
