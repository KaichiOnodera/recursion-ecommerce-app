import { User } from '../domains/entities/User';

export interface IGetMeInteractor {
  execute(userId: number): Promise<User>;
}
