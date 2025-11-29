import { ILoginInteractor } from '../usecases/ILoginInteractor';
import { IUserRepository } from '../domains/repositories/IUserRepository';
import { generateJWT, TOKEN_VERSION } from '../../../utils/jwt';
import { User } from '@shared/schemas/user';
import { comparePassword } from '../../../contexts/utils/hashPassword';

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

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
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
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
