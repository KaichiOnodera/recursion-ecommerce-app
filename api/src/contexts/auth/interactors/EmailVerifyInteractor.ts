import { IEmailVerifyInteractor } from '../usecases/IEmailVerifyInteractor';
import { IUserRepository } from '../../users/domains/repositories/IUserRepository';
import { IEmailVerificationTokenRepository } from '../domains/repositories/IEmailVerificationTokenRepository';

export class EmailVerifyInteractor implements IEmailVerifyInteractor {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationTokenRepository: IEmailVerificationTokenRepository,
  ) {}

  async verifyEmail(token: string): Promise<void> {
    const verificationToken =
      await this.emailVerificationTokenRepository.findByToken(token);
    if (!verificationToken) {
      throw new Error('Invalid or expired verification token');
    }

    const user = await this.userRepository.findById(verificationToken.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...user,
      emailVerified: true,
    };

    await this.userRepository.update(user.id, updatedUser);
    await this.emailVerificationTokenRepository.deleteById(
      verificationToken.id,
    );
  }
}
