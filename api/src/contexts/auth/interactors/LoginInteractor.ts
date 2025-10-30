import { ILoginInteractor } from '../usecases/ILoginInteractor';
import { IUserRepository } from '../domains/repositories/IUserRepository';
import { generateJWT, TOKEN_VERSION } from '../../../utils/jwt';
import { User } from '@shared/schemas/user';

export class LoginInteractor implements ILoginInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    email: string,
    password: string,
    expectedRole?: 'USER' | 'ADMIN',
  ): Promise<{
    token: string;
    user: User;
  }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (password !== user.password) {
      throw new Error('Invalid email or password');
    }

    // ロールチェック
    if (expectedRole && user.role !== expectedRole) {
      throw new Error(
        `Invalid role: Expected ${expectedRole}, got ${user.role}`,
      );
    }

    const token = await generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      version: TOKEN_VERSION,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
