import { User } from "../domains/entities/User";

export interface IUpdateUserProfileInteractor {
  execute(): Promise<User[]>;
}
