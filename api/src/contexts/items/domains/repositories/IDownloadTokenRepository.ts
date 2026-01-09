import { DownloadToken } from '../entities/DownloadToken';

export interface IDownloadTokenRepository {
  findById(id: number): Promise<DownloadToken | null>;
  findByOrderId(orderId: number): Promise<DownloadToken>;
  findByToken(token: string): Promise<DownloadToken | null>;
  create(
    orderId: number,
    userId: number | null,
    token: string,
  ): Promise<DownloadToken>;
  incrementUsedAmount(id: number): Promise<void>;
}
