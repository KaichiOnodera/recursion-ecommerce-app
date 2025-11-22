import { IUserRepository } from "../domains/repositories/IUserRepository";
import { User } from "../domains/entities/User";

export class GetUserByIdInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: number): Promise<User | null> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await this.userRepository.findById(userId);
    return user;
  }
}
