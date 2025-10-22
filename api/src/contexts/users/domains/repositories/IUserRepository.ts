import { User } from "../entities/User";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findBy(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user:{
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    role: number;
    }): Promise<User>;
}
