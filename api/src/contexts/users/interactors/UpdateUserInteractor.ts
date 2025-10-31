import { IUserRepository } from "../domains/repositories/IUserRepository";
import { User } from "../domains/entities/User";

export interface UpdateUserInput {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  role?: number;
}

export class UpdateUserInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const { id, ...updateData } = input;

    //validation for user
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    //exec update
    const updatedUser = await this.userRepository.update(id, updateData);

    return updatedUser;
  }
}
