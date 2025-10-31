import { User } from "../domains/entities/User";

export interface IDeleteUserInteractor {
  execute(): Promise<User[]>;
}
