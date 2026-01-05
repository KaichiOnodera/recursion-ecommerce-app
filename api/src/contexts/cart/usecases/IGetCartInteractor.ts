import { Cart } from '../domains/entities/Cart';

export interface IGetCartInteractor {
  execute(userId?: number, sessionId?: string): Promise<Cart | null>;
}
