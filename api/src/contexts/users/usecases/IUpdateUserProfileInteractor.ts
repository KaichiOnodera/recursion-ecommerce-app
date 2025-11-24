import { User } from '../domains/entities/User';

export interface IUpdateUserInteractor {
  execute(): Promise<User[]>;
}
