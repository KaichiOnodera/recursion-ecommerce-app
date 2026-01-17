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

    // Stripe製品IDがある場合、Stripeからも削除を試行
    if (mapping?.stripeProductId) {
      try {
        // 製品に関連する価格が存在するかチェック
        const prices = await this.stripeAdapter.listPrices(
          mapping.stripeProductId,
        );

        if (prices.data.length > 0) {
          // 価格が存在する場合、製品を非アクティブ化（アーカイブ）
          await this.stripeAdapter.updateProduct(mapping.stripeProductId, {
            active: false,
          });
        } else {
          // 価格が存在しない場合、製品を削除
          await this.stripeAdapter.deleteProduct(mapping.stripeProductId);
        }
      } catch (error) {
        // Stripe削除/非アクティブ化に失敗しても、DB削除は続行（楽観的アプローチ）
        console.error(
          `Failed to delete/archive Stripe product ${mapping.stripeProductId}:`,
          error,
        );
      }
    }

    return await this.itemRepository.delete(id);
  }
}
