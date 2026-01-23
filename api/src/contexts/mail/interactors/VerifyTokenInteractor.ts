import { IVerifyTokenInteractor } from '../usecases/IVerifyTokenInteractor';
import { IEmailAdapter } from '../domains/adapters/IEmailAdapter';
import { IUserRepository } from '../../auth/domains/repositories/IUserRepository';
import { IEmailVerificationTokenRepository } from '../../auth/domains/repositories/IEmailVerificationTokenRepository';
import { VERIFY_TOKEN_TEMPLATE } from './templates/VerifyTokenTemplate';
import { generateverificationtoken } from '../../../utils/verificationtoken';
import { EMAIL_VERIFICATION_PATH } from '../../../constants/routes';

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

    const frontendBaseUrl = process.env.FRONTEND_BASE_URL;
    if (!frontendBaseUrl) {
      console.error('[VerifyTokenInteractor] FRONTEND_BASE_URL is not set');
      throw new Error('FRONTEND_BASE_URL is not set');
    }
    const verificationUrl = `${frontendBaseUrl}${EMAIL_VERIFICATION_PATH}?token=${token}`;

    const message = {
      to,
      ...VERIFY_TOKEN_TEMPLATE(verificationUrl),
    };

    try {
      await this.emailAdapter.send(message);
    } catch (error) {
      console.error(`[VerifyTokenInteractor] Failed to send email:`, error);
      throw error;
    }
  }
}
