export interface IRemoveFavoriteInteractor {
  execute(userId: number, itemId: number): Promise<void>;
}
