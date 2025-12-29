import { IUserRepository } from '../domains/repositories/IUserRepository';
import { User } from '../domains/entities/User';
import {
  IUpdateUserProfileInteractor,
  UpdateUserProfileInput,
} from '../usecases/IUpdateUserProfileInteractor';

export class UpdateUserProfileInteractor
  implements IUpdateUserProfileInteractor
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserProfileInput): Promise<User> {
    const { id, lastName, firstName, email } = input;

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // emailが変更される場合、isResigned=falseのレコードに絞って重複チェック
    if (email && email !== existingUser.email) {
      const existedUser = await this.userRepository.findByEmail(email);
      if (existedUser && existedUser.id !== id && !existedUser.isResigned) {
        throw new Error('Mail is registered already');
      }
    }

    const updatedUser = await this.userRepository.update(id, {
      lastName: lastName ?? existingUser.lastName,
      firstName: firstName ?? existingUser.firstName,
      email: email ?? existingUser.email,
    });

    return updatedUser;
  }
}
