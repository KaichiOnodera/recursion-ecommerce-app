import { ILoginInteractor } from '../usecases/ILoginInteractor';
import { IUserRepository } from '../domains/repositories/IUserRepository';
import { signJWT } from '../../../utils/jwt';

export class LoginInteractor implements ILoginInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    email: string,
    password: string,
    expectedRole?: 'USER' | 'ADMIN',
  ): Promise<{
    token: string;
    user: { id: number; email: string; role: string };
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

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
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
