import { User } from "../domains/entities/User";

export interface IGetUserByIdInteractor {
  execute(userId:number): Promise<User | null>;
}
