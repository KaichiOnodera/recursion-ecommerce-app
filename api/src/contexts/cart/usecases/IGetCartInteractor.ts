import { Cart } from '../domains/entities/Cart';

export interface IGetCartInteractor {
  execute(userId: number): Promise<Cart | null>;
}
