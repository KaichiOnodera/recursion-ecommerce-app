import { IUpdateCartInteractor } from '../usecases/IUpdateCartInteractor';
import { ICartRepository } from '../domains/repositories/ICartRepository';
import { ICartItemRepository } from '../domains/repositories/ICartItemRepository';
import { IItemRepository } from '../../items/domains/repositories/IItemRepository';
import { Cart } from '../domains/entities/Cart';

export class UpdateCartInteractor implements IUpdateCartInteractor {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly cartItemRepository: ICartItemRepository,
    private readonly itemRepository: IItemRepository,
  ) {}

  async execute(
    userId: number | undefined,
    sessionId: string | undefined,
    items: Array<{ id: number; amount: number }>,
  ): Promise<Cart> {
    // 在庫チェック
    for (const item of items) {
      const product = await this.itemRepository.findById(item.id);
      if (!product) {
        throw new Error(`Item with id ${item.id} not found`);
      }
      if (product.inventory.amount < item.amount) {
        throw new Error(
          `Insufficient inventory for item ${product.name}. Available: ${product.inventory.amount}, Requested: ${item.amount}`,
        );
      }
    }

    const cart = await this.getOrCreateCart(userId, sessionId);

    for (const item of items) {
      await this.cartItemRepository.upsert(cart.id, item.id, item.amount);
    }

    const updatedCart = await this.cartRepository.findById(cart.id);
    if (!updatedCart) {
      throw new Error('Cart not found after update');
    }

    return updatedCart;
  }

  private async getOrCreateCart(
    userId: number | undefined,
    sessionId: string | undefined,
  ): Promise<Cart> {
    if (userId !== undefined) {
      return (
        (await this.cartRepository.findByUserId(userId)) ??
        (await this.cartRepository.createByUserId(userId))
      );
    }

    if (sessionId !== undefined) {
      return await this.cartRepository.findBySessionIdOrCreate(sessionId);
    }

    throw new Error('Either userId or sessionId must be provided');
  }
}
