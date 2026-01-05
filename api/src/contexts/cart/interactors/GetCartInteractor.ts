import { IGetCartInteractor } from '../usecases/IGetCartInteractor';
import { ICartRepository } from '../domains/repositories/ICartRepository';
import { Cart } from '../domains/entities/Cart';

export class GetCartInteractor implements IGetCartInteractor {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId?: number, sessionId?: string): Promise<Cart | null> {
    const cart = await this.fetchCart(userId, sessionId);

    if (!cart) {
      return null;
    }

    return this.mapCart(cart);
  }

  private async fetchCart(
    userId?: number,
    sessionId?: string,
  ): Promise<Cart | null> {
    if (userId !== undefined) {
      return this.cartRepository.findByUserId(userId);
    }

    if (sessionId !== undefined) {
      return this.cartRepository.findBySessionId(sessionId);
    }

    return null;
  }

  private mapCart(cart: Cart): Cart {
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
