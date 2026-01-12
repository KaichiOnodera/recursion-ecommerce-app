export interface IDeleteTagInteractor {
  execute(id: number): Promise<boolean>;
}
