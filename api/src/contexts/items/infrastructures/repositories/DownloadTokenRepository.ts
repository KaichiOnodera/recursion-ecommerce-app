import { PrismaClient } from '@prisma/client';
import { IDownloadTokenRepository } from '../../domains/repositories/IDownloadTokenRepository';
import { DownloadToken } from '../../domains/entities/DownloadToken';

export class DownloadTokenRepository implements IDownloadTokenRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<DownloadToken | null> {
    const downloadtoken = await this.prisma.downloadToken.findUnique({
      where: { id },
    });
    return downloadtoken;
  }

  async findByOrderId(orderId: number): Promise<DownloadToken> {
    const downloadtoken = await this.prisma.downloadToken.findUnique({
      where: { orderId },
    });
    if (!downloadtoken) {
      throw new Error('DownloadToken not found');
    }
    return downloadtoken;
  }

  async findByToken(token: string): Promise<DownloadToken | null> {
    const downloadtoken = await this.prisma.downloadToken.findFirst({
      where: { token },
    });
    return downloadtoken;
  }

  async create(
    orderId: number,
    userId: number | null,
    token: string,
  ): Promise<DownloadToken> {
    const downloadtoken = await this.prisma.downloadToken.create({
      data: {
        orderId,
        userId,
        token,
        usedAmount: 0,
      },
    });
    return downloadtoken;
  }
  async incrementUsedAmount(id: number): Promise<void> {
    await this.prisma.downloadToken.update({
      where: { id },
      data: {
        usedAmount: {
          increment: 1,
        },
      },
    });
  }
}
