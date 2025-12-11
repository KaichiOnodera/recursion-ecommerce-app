import { IUserRepository } from '../domains/repositories/IUserRepository';
import { User } from '../domains/entities/User';

export interface UpdateUserProfileInput {
  id: number;
  lastName?: string;
  firstName?: string;
  email?: string;
}

export class UpdateUserProfileInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserProfileInput): Promise<User> {
    const { id, lastName, firstName, email } = input;

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const existedUser = await this.userRepository.findByEmail(String(email));
    if (existedUser) {
      throw new Error('Mail is registered already');
    }

    const updatedUser = await this.userRepository.update(id, {
      lastName: lastName ?? existingUser.lastName,
      firstName: firstName ?? existingUser.firstName,
      email: email ?? existingUser.email,
    });

    return updatedUser;
  }
}
