export interface ICheckFavoriteInteractor {
  execute(userId: number, itemId: number): Promise<boolean>;
}
