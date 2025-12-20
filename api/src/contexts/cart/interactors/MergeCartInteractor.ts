import { IMergeCartInteractor } from '../usecases/IMergeCartInteractor';
import { ICartRepository } from '../domains/repositories/ICartRepository';
import { ICartItemRepository } from '../domains/repositories/ICartItemRepository';
import { Cart } from '../domains/entities/Cart';

export class MergeCartInteractor implements IMergeCartInteractor {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly cartItemRepository: ICartItemRepository,
  ) {}

  async execute(userId: number, sessionCart: Cart): Promise<Cart> {
    const userCart =
      (await this.cartRepository.findByUserId(userId)) ??
      (await this.cartRepository.createByUserId(userId));

    // 同一商品IDの数量を合算
    const mergedItemsMap = new Map<number, number>();

    // ユーザーカートのアイテムを追加
    for (const item of userCart.items) {
      mergedItemsMap.set(item.id, item.amount);
    }

    // セッションカートのアイテムを合算
    for (const item of sessionCart.items) {
      const existingAmount = mergedItemsMap.get(item.id) ?? 0;
      mergedItemsMap.set(item.id, existingAmount + item.amount);
    }

    // マージ後のアイテムをユーザーカートに反映
    for (const [itemId, amount] of mergedItemsMap.entries()) {
      await this.cartItemRepository.upsert(userCart.id, itemId, amount);
    }

    const updatedCart = await this.cartRepository.findById(userCart.id);
    if (!updatedCart) {
      throw new Error('Cart not found after merge');
    }

    return updatedCart;
  }
}
