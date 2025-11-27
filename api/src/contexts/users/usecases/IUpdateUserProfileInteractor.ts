import { User } from '../domains/entities/User';
import { UpdateUserProfileInput } from '../interactors/UpdateUserProfileInteractor';

export interface IUpdateUserProfileInteractor {
  execute(input: UpdateUserProfileInput): Promise<User>;
}
