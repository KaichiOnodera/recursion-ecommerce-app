import { User } from '../domains/entities/User';

export interface UpdateUserProfileInput {
  id: number;
  lastName?: string;
  firstName?: string;
  email?: string;
}

export interface IUpdateUserProfileInteractor {
  execute(input: UpdateUserProfileInput): Promise<User>;
}
