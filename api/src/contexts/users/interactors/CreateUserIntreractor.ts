import { IUserRepository } from "../domains/repositories/IUserRepository";
import { User } from "../domains/entities/User";
import { hashPassword } from "../../utils/hashPassword";
import { ICreateUserRequest } from "../usecases/ICreateUserInteractor";

export class CreateUserInteractor {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: ICreateUserRequest): Promise<User> {
    const { lastName, firstName, email, password, role } = input;

    //validation for email
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
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
      role,
    });

    return createdUser;
  }
}
