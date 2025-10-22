import { IGetUsersInteractor } from "../usecases/IGetUsersInteractor";
import { IUserRepository } from "../domains/repositories/IUserRepository";
import { User } from "../domains/entities/User";

export class GetUsersInteractor implements IGetUsersInteractor {
  constructor(private readonly UserRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.UserRepository.findAll();
  }
}
