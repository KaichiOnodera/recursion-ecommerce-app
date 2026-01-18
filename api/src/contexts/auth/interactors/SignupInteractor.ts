import { IUserRepository } from '../domains/repositories/IUserRepository';
import { User } from '../domains/entities/User';
import { hashPassword } from '../../utils/hashPassword';
import {
  ISignupRequest,
  ISignupInteractor,
} from '../usecases/ISignupInteractor';
import { IVerifyTokenInteractor } from '../../mail/usecases/IVerifyTokenInteractor';

export class SignupInteractor implements ISignupInteractor {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly verifyTokenInteractor: IVerifyTokenInteractor,
  ) {}

  async execute(input: ISignupRequest): Promise<User> {
    const { lastName, firstName, email, password } = input;

    //validation for email
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // exec user
    const createdUser = await this.userRepository.create({
      lastName,
      firstName,
      email,
      password: hashedPassword,
      isResigned: false,
      emailVerified: false,
      role: 'USER',
    });

    // メール認証メールを送信（エラーが発生してもユーザー登録は成功させる）
    try {
      await this.verifyTokenInteractor.VerifyToken(createdUser.id);
    } catch (error) {
      console.error(
        `[SignupInteractor] Failed to send verification email for user ${createdUser.id}:`,
        error,
      );
      // メール送信に失敗してもユーザー登録は成功させる
    }

    return createdUser;
  }
}
