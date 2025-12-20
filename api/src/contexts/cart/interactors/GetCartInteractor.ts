import { IGetCartInteractor } from '../usecases/IGetCartInteractor';
import { ICartRepository } from '../domains/repositories/ICartRepository';
import { Cart } from '../domains/entities/Cart';

export class GetCartInteractor implements IGetCartInteractor {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId: number): Promise<Cart | null> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      return null;
    }

    return {
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        type: item.type,
        price: item.price,
        displayStatus: item.displayStatus,
        amount: item.amount,
      })),
    };
  }
}
