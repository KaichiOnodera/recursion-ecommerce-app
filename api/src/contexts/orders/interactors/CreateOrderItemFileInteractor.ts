import { OrderItemFile } from '../domains/entities/OrderItemFile';
import { IOrderItemFileRepository } from '../domains/repositories/IOrderItemFileRepository';
import { ICreateOrderItemFileInteractor } from '../usecases/ICreateOrderItemFileInteractor';
import { IItemRepository } from 'src/contexts/items/domains/repositories/IItemRepository';

export class CreateOrderItemFileInteractor
  implements ICreateOrderItemFileInteractor
{
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly orderItemFileRepository: IOrderItemFileRepository,
  ) {}

  async createByitemId(orderId: number, itemId: number) {
    const item = await this.itemRepository.findById(itemId);

    if (!item) {
      throw new Error('Item not found');
    }

    const type = item.type;

    if (type == 2) {
      const orderItemFile = await this.orderItemFileRepository.create(
        orderId,
        itemId,
      );
      return orderItemFile;
    } else {
      throw new Error('Item is not a digital product');
    }
  }

  async createByOrderId(orderId: number): Promise<OrderItemFile[]> {
    const order = await this.orderItemFileRepository.findByOrderId(orderId);
    const items = await order.map(async (orderItemFile) => {
      const item = await this.itemRepository.findById(orderItemFile.itemId);
      if (item && item.type == 2) {
        await this.orderItemFileRepository.create(
          orderId,
          orderItemFile.itemId,
        );
      }
    });
    return Promise.all(items).then(() => {
      return this.orderItemFileRepository.findByOrderId(orderId);
    });
  }
}
