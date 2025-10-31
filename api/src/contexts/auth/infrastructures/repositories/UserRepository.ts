import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../domains/repositories/IUserRepository';
import { User } from '../../domains/entities/User';

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: {
        email,
        isResigned: false,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
