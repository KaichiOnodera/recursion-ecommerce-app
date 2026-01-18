export interface IGetTagUsageCountInteractor {
  execute(id: number): Promise<number>;
}
