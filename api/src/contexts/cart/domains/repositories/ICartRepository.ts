import { Cart } from '../entities/Cart';

export interface ICartRepository {
  find(userId: number): Promise<Cart | null>;
  create(userId: number): Promise<Cart>;
}
