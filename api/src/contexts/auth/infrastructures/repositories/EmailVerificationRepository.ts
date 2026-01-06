import { PrismaClient } from '@prisma/client';
import { EmailVerificationToken } from '../../domains/entities/EmailVerificationToken';
import { IEmailVerificationTokenRepository } from '../../domains/repositories/IEmailVerificationTokenRepository';
import { EmailVerificationTokenInput } from '../../domains/repositories/IEmailVerificationTokenRepository';

export class EmailVerificationRepository
  implements IEmailVerificationTokenRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(token: EmailVerificationToken): Promise<EmailVerificationToken> {
    const created = await this.prisma.emailVerificationToken.create({
      data: {
        token: token.token,
        userId: token.userId,
      },
    });

    return {
      id: created.id,
      token: created.token,
      userId: created.userId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async findByToken(token: string): Promise<EmailVerificationToken | null> {
    const found = await this.prisma.emailVerificationToken.findUnique({
      where: {
        token,
      },
    });

    if (!found) return null;

    return {
      id: found.id,
      token: found.token,
      userId: found.userId,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    };
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.emailVerificationToken.delete({
      where: { id },
    });
  }

  async upsert(
    input: EmailVerificationTokenInput,
  ): Promise<EmailVerificationToken> {
    const saved = await this.prisma.emailVerificationToken.upsert({
      where: { userId: input.userId },
      create: {
        userId: input.userId,
        token: input.token,
      },
      update: {
        token: input.token,
      },
    });

    return {
      id: saved.id,
      token: saved.token,
      userId: saved.userId,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
