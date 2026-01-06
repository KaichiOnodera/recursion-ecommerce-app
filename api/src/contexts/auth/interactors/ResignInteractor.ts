import { IUserRepository } from '../domains/repositories/IUserRepository';
import { IResignInteractor } from '../usecases/IResignInteractor';

export class ResignInteractor implements IResignInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: number): Promise<void> {
    await this.userRepository.update(userId, { isResigned: true });
  }
}
