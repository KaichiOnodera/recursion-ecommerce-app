import { Cart } from '../domains/entities/Cart';

export interface ICartInteractor {
  execute(
    userId: number | undefined,
    sessionId: string | undefined,
    items: Array<{ id: number; amount: number }>,
  ): Promise<Cart>;
}
