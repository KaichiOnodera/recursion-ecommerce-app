import { User } from '../domains/entities/User';

export interface ICreateUserRequest {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

export interface ICreateUserInteractor {
  execute(input: ICreateUserRequest): Promise<User>;
}