import { IVerifyTokenInteractor } from '../usecases/IVerifyTokenInteractor';
import { IEmailAdapter } from '../domains/adapters/IEmailAdapter';
import { IUserRepository } from '../../users/domains/repositories/IUserRepository';
import { IEmailVerificationTokenRepository } from '../../auth/domains/repositories/IEmailVerificationTokenRepository';
import { VERIFY_TOKEN_TEMPLATE } from './templates/VerifyTokenTemplate';
import { generateverificationtoken } from '../../../utils/verificationtoken';

export class VerifyTokenInteractor implements IVerifyTokenInteractor {
  constructor(
    private readonly emailAdapter: IEmailAdapter,
    private readonly userRepository: IUserRepository,
    private readonly emailverificationtokenRepository: IEmailVerificationTokenRepository,
  ) {}

  async VerifyToken(userId: number): Promise<void> {
    const user = await this.userRepository.findById(Number(userId));
    if (!user) {
      throw new Error('User not found');
    }

    const token = generateverificationtoken();

    await this.emailverificationtokenRepository.upsert({
      token,
      userId: user.id,
    });

    const to = user.email;

    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;

    const message = {
      to,
      ...VERIFY_TOKEN_TEMPLATE(verificationUrl),
    };
    await this.emailAdapter.send(message);
  }
}
