import { Cart } from '../domains/entities/Cart';

export interface ICartInteractor {
  execute(
    userId: number,
    items: Array<{ id: number; amount: number }>,
  ): Promise<Cart>;
}
