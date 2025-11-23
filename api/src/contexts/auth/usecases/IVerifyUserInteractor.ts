export interface IVerifyUserInteractor {
  execute(userId: number): Promise<boolean>;
}
