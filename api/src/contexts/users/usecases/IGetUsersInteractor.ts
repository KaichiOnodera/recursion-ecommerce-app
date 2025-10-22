import { User } from "../domains/entities/User";

export interface IGetUsersInteractor {
  execute(): Promise<User[]>;
}
