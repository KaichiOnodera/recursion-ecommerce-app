import { User } from '../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(data: Omit<User, 'createdAt' | 'updatedAt' | 'id'>): Promise<User>;
}
