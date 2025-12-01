import { ICartInteractor } from '../usecases/ICartInteractor';
import { ICartRepository } from '../domains/repositories/ICartRepository';
import { ICartItemRepository } from '../domains/repositories/ICartItemRepository';
import { Cart } from '../domains/entities/Cart';

export class CartInteractor implements ICartInteractor {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly cartItemRepository: ICartItemRepository,
  ) {}

  async execute(
    userId: number,
    items: Array<{ id: number; amount: number }>,
  ): Promise<Cart> {
    const cart =
      (await this.cartRepository.find(userId)) ??
      (await this.cartRepository.create(userId));

    for (const item of items) {
      await this.cartItemRepository.upsert(cart.id, item.id, item.amount);
    }

    const updatedCart = await this.cartRepository.find(userId);
    if (!updatedCart) {
      throw new Error('Cart not found after update');
    }

    return updatedCart;
  }
}
