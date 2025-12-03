import { IGetCartInteractor } from '../usecases/IGetCartInteractor';
import { ICartRepository } from '../domains/repositories/ICartRepository';
import { GetRes } from '@shared/types/gets';

export class GetCartInteractor implements IGetCartInteractor {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: number): Promise<GetRes['/cart']> {
    const cart = await this.cartRepository.find(userId);

    if (!cart) {
      return {
        items: [],
      };
    }

    return {
      items: cart.items.map((item) => ({
        id: item.id,
        amount: item.amount,
      })),
    };
  }
}
