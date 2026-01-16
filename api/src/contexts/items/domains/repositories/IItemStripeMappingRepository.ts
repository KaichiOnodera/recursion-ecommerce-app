import { ItemStripeMapping } from '../entities/ItemStripeMapping';

export interface IItemStripeMappingRepository {
  findByItemId(itemId: number): Promise<ItemStripeMapping | null>;
  findByStripeProductId(
    stripeProductId: string,
  ): Promise<ItemStripeMapping | null>;
  create(
    itemId: number,
    stripeProductId: string,
    stripePriceId?: string,
  ): Promise<ItemStripeMapping>;
  update(
    itemId: number,
    stripeProductId: string,
    stripePriceId?: string,
  ): Promise<ItemStripeMapping>;
  delete(itemId: number): Promise<void>;
}
