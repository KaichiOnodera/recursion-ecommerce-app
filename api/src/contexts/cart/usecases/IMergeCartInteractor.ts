import { Cart } from '../domains/entities/Cart';

export interface IMergeCartInteractor {
  execute(userId: number, sessionCart: Cart): Promise<Cart>;
}
