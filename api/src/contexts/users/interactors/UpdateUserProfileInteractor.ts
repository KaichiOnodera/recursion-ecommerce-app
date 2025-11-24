import { IUserRepository } from '../domains/repositories/IUserRepository';
import { User } from '../domains/entities/User';

export interface UpdateUserProfileInput {
  id: number;
  name?: string;
  email?: string;
  password?: string;
}

export class UpdateUserProfileInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserProfileInput): Promise<User> {
    const { id, ...updateData } = input;

    //validation for user
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    //exec update
    const UpdateUserProfile = await this.userRepository.update(id, updateData);

    return UpdateUserProfile;
  }
}
