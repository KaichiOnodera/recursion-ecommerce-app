import { User } from "../domains/entities/User";

export interface ICreateUserRequest {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  isResigned:boolean;
  role: number;
}

export interface ICreateUserInteractor {
  execute(input: ICreateUserRequest): Promise<User>;
}
