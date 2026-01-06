export interface IVerifyTokenInteractor {
  VerifyToken(to: string): Promise<void>;
}
