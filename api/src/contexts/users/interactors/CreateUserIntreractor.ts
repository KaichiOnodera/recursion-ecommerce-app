import { ICreateUserInteractor } from "../usecases/ICreateUserInteractor";
import { IUserRepository } from "../domains/repositories/IUserRepository";
import { User } from "../domains/entities/User";
import { hashPassword } from "../../utils/hashPassword";

export interface ICreateUserRequest {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    role: number;
}

export class CreateUserInteractor implements ICreateUserInteractor {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: ICreateUserRequest): Promise<User> {
    const { lastName, firstName, email, password, role } = request;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error("Email already exists");

    const hashedPassword = await hashPassword(password);

    const roleNumber = role;

    const user = await this.userRepository.create({
      lastName,
      firstName,
      email,
      password: hashedPassword,
      role: roleNumber,
    });

    return user;
  }
}
