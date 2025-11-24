import { IVerifyUserInteractor } from '../usecases/IVerifyUserInteractor';
import { IUserRepository } from '../domains/repositories/IUserRepository';

export class VerifyUserInteractor implements IVerifyUserInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: number): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    return user !== null;
  }
}
