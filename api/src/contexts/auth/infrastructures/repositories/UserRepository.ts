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
      emailVerified: user.emailVerified,
      role: user.role,
      isResigned: user.isResigned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
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
      emailVerified: user.emailVerified,
      role: user.role,
      isResigned: user.isResigned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const user = await this.prisma.users.create({ data });
    return {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      password: user.password,
      role: user.role,
      isResigned: user.isResigned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(
    id: number,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<User> {
    const user = await this.prisma.users.update({
      where: { id },
      data: {
        ...data,
      },
    });
    return {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      password: user.password,
      role: user.role,
      isResigned: user.isResigned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
