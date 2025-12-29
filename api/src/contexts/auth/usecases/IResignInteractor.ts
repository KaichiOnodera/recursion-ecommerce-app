export interface IResignInteractor {
  execute(userId: number): Promise<void>;
}
