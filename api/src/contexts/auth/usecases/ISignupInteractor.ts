import { User } from '../domains/entities/User';

export interface ISignupRequest {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

export interface ISignupInteractor {
  execute(input: ISignupRequest): Promise<User>;
}
