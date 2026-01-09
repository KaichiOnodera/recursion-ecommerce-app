import { IDownloadDigitalItemInteractor } from '../usecases/IDownloadDigitalItemInteractor';
import { IDownloadTokenRepository } from '../domains/repositories/IDownloadTokenRepository';
import { OrderItemFileRepository } from 'src/contexts/orders/infrastructures/repositories/OrderItemFileRepository';
import { ItemFileRepository } from 'src/contexts/items/infrastructures/repositories/ItemFileRepository';

export class DownloadDigitalItemInteractor
  implements IDownloadDigitalItemInteractor
{
  constructor(
    private readonly orderItemFileRepository: OrderItemFileRepository,
    private readonly downloadTokenRepository: IDownloadTokenRepository,
    private readonly itemFileRepository: ItemFileRepository,
  ) {}

  async execute(
    token: string,
  ): Promise<{ storagePath: string; filename: string }> {
    const downloadToken = await this.downloadTokenRepository.findByToken(token);
    if (!downloadToken) throw new Error('Invalid download token');

    if (!downloadToken.orderId) {
      throw new Error('Download token is not associated with any order');
    }

    const isGuest = downloadToken.userId == null;
    if (isGuest && downloadToken.usedAmount >= 1) {
      throw new Error('Download token has already been used');
    }

    const orderItemFiles = await this.orderItemFileRepository.findByOrderId(
      downloadToken.orderId,
    );
    if (orderItemFiles.length === 0) {
      throw new Error('No digital items found for the given download token');
    }

    const target = orderItemFiles[0];
    if (!target.itemId)
      throw new Error('Invalid orderItemFile: itemId is null');

    const itemFiles = await this.itemFileRepository.findByItemId(target.itemId);
    if (!itemFiles || itemFiles.length === 0)
      throw new Error('Item file not found');

    const itemFile = itemFiles[0];
    const storagePath = itemFile.path;
    const filename = itemFile.filename;

    await this.downloadTokenRepository.incrementUsedAmount(downloadToken.id);

    return { storagePath, filename };
  }
}
