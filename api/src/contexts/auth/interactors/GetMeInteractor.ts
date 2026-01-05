import { IGetMeInteractor } from '../usecases/IGetMeInteractor';
import { IUserRepository } from '../domains/repositories/IUserRepository';
import { User } from '../domains/entities/User';

export class GetMeInteractor implements IGetMeInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      password: user.password,
      role: user.role,
      isResigned: user.isResigned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
