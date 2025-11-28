export interface IDeleteItemInteractor {
  execute(id: number): Promise<boolean>;
}
