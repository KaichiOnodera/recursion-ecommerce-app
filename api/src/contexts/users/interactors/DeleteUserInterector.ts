import { IUserRepository } from "../domains/repositories/IUserRepository";

export class DeleteUserInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    await this.userRepository.update(id, { deletedAt: new Date() });
  }
}
