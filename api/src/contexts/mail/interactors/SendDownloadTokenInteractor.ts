import { IOrderItemFileRepository } from 'src/contexts/orders/domains/repositories/IOrderItemFileRepository';
import { ISendDownloadTokenInteractor } from '../usecases/ISendDownloadTokenInteractor';
import { generateDownloadToken } from 'src/utils/downloadtoken';
import { IDownloadTokenRepository } from 'src/contexts/items/domains/repositories/IDownloadTokenRepository';
import { UserRepository } from 'src/contexts/auth/infrastructures/repositories/UserRepository';
import { OrderRepository } from 'src/contexts/orders/infrastructures/repositories/OrderRepository';
import { IEmailAdapter } from '../domains/adapters/IEmailAdapter';
import { SEND_DOWNLOAD_TOKEN_TEMPLATE } from './templates/SendDownloadTokenTemplate';

export class SendDownloadTokenInteractor
  implements ISendDownloadTokenInteractor
{
  constructor(
    private readonly downloadTokenRepository: IDownloadTokenRepository,
    private readonly orderItemFileRepository: IOrderItemFileRepository,
    private readonly userRepository: UserRepository,
    private readonly orderRepository: OrderRepository,
    private readonly emailAdapter: IEmailAdapter,
  ) {}

  async execute(orderId: number): Promise<string> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error('Order not found');

    const orderItemFiles =
      await this.orderItemFileRepository.findByOrderId(orderId);
    if (orderItemFiles.length === 0) {
      throw new Error('No digital items found for this order');
    }

    const user = order.userId
      ? await this.userRepository.findById(order.userId)
      : null;

    const to = order?.email ?? order.email;
    if (!to) throw new Error('Recipient email not found');

    let downloadtoken =
      await this.downloadTokenRepository.findByOrderId(orderId);
    if (!downloadtoken) {
      const token = generateDownloadToken();
      if (!token) {
        throw new Error('Failed to generate download token');
      }

      downloadtoken = await this.downloadTokenRepository.create(
        orderId,
        user ? user.id : null,
        token,
      );
    }

    const base = process.env.API_BASE_URL ?? process.env.FRONTEND_BASE_URL;
    if (!base) throw new Error('API_BASE_URL or FRONTEND_BASE_URL is missing');

    const url = `${base}/download/${downloadtoken.token}`;

    const message = SEND_DOWNLOAD_TOKEN_TEMPLATE(
      to,
      orderId,
      url,
      user?.firstName,
    );
    await this.emailAdapter.send(message);

    return url;
  }
}
