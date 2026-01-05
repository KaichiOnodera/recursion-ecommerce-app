import { ICheckFavoriteInteractor } from '../usecases/ICheckFavoriteInteractor';
import { IFavoriteRepository } from '../domains/repositories/IFavoriteRepository';

export class CheckFavoriteInteractor implements ICheckFavoriteInteractor {
  constructor(private readonly favoriteRepository: IFavoriteRepository) {}

  async execute(userId: number, itemId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findByUserIdAndItemId(
      userId,
      itemId,
    );
    return favorite !== null;
  }
}
