export interface IEmailVerifyInteractor {
  verifyEmail(token: string): Promise<void>;
}
