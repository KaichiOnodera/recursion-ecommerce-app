import { IDeleteCartInteractor } from '../usecases/IDeleteCartInteractor';
import { ICartRepository } from '../domains/repositories/ICartRepository';

export class DeleteCartInteractor implements IDeleteCartInteractor {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(userId?: number, sessionId?: string): Promise<void> {
    if (userId !== undefined) {
      await this.cartRepository.deleteByUserId(userId);
      return;
    }

    if (sessionId !== undefined) {
      await this.cartRepository.deleteBySessionId(sessionId);
      return;
    }

    throw new Error('Either userId or sessionId must be provided');
  }
}
