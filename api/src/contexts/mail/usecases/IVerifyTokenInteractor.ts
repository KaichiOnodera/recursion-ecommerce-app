export interface IVerifyTokenInteractor {
  VerifyToken(user: number): Promise<void>;
}
