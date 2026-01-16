import { IDeleteItemInteractor } from '../usecases/IDeleteItemInteractor';
import { IItemRepository } from '../../domains/repositories/IItemRepository';
import { IStripeAdapter } from '../../../checkout/domains/adapters/IStripeAdapter';
import { IItemStripeMappingRepository } from '../../domains/repositories/IItemStripeMappingRepository';

export class DeleteItemInteractor implements IDeleteItemInteractor {
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly stripeAdapter: IStripeAdapter,
    private readonly itemStripeMappingRepository: IItemStripeMappingRepository,
  ) {}

  async execute(id: number): Promise<boolean> {
    // 製品が存在するか確認
    const item = await this.itemRepository.findById(id);
    if (!item) {
      return false;
    }

    // ItemStripeMappingからstripeProductIdを取得
    const mapping = await this.itemStripeMappingRepository.findByItemId(id);

    // Stripe製品IDがある場合、Stripeからも削除
    if (mapping?.stripeProductId) {
      try {
        // 製品に関連するすべての価格を取得
        const prices = await this.stripeAdapter.listPrices(
          mapping.stripeProductId,
        );

        // 各価格を非アクティブにする（Stripe製品を削除するには、価格を非アクティブにする必要がある）
        for (const price of prices.data) {
          try {
            await this.stripeAdapter.updatePrice(price.id, { active: false });
          } catch (priceError) {
            // 価格の非アクティブ化に失敗しても続行
            console.warn(`Failed to deactivate price ${price.id}:`, priceError);
          }
        }

        // 価格を非アクティブにした後、製品を削除
        await this.stripeAdapter.deleteProduct(mapping.stripeProductId);
      } catch (error) {
        // Stripe削除に失敗しても、DB削除は続行
        console.error(
          `Failed to delete Stripe product ${mapping.stripeProductId}:`,
          error,
        );
        // エラーログを記録するが、処理は続行
      }
    }

    return await this.itemRepository.delete(id);
  }
}
