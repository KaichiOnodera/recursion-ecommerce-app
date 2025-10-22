import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domains/repositories/IUserRepository";
import { User } from "../../domains/entities/User";

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}
    findAll(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    findBy(id: number): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.users.findUnique({ where: { email } });
  }

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    return await this.prisma.users.create({ data });
  }
}
