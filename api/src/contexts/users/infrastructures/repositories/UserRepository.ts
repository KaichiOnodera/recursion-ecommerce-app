import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../domains/repositories/IUserRepository';
import { User } from '../../domains/entities/User';

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<User | null> {
    return this.prisma.users.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.users.findUnique({ where: { email } });
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> {
    return this.prisma.users.create({ data });
  }

  async update(
    id: number,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<User> {
    return this.prisma.users.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.users.delete({ where: { id } });
  }
}
