import { Cart } from '../entities/Cart';

export interface ICartRepository {
  findByUserId(userId: number): Promise<Cart | null>;
  createByUserId(userId: number): Promise<Cart>;
  findBySessionId(sessionId: string): Promise<Cart | null>;
  createWithSessionId(sessionId: string): Promise<Cart>;
  findBySessionIdOrCreate(sessionId: string): Promise<Cart>;
  deleteBySessionId(sessionId: string): Promise<void>;
}
