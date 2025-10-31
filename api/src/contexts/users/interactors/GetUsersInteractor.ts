import { IUserRepository } from "../domains/repositories/IUserRepository";
import { User } from "../domains/entities/User";

export class GetUsersInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
