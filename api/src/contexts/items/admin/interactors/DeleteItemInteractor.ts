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
        // まず製品を削除を試行
        await this.stripeAdapter.deleteProduct(mapping.stripeProductId);
      } catch (deleteError: unknown) {
        // 削除に失敗した場合（価格が存在する場合など）、製品を非アクティブ化する
        const errorMessage =
          deleteError instanceof Error
            ? deleteError.message
            : String(deleteError);
        if (
          errorMessage.includes(
            'cannot be deleted because it has one or more user-created prices',
          )
        ) {
          // 価格が存在するため削除できない場合、製品を非アクティブ化（アーカイブ）
          try {
            await this.stripeAdapter.updateProduct(mapping.stripeProductId, {
              active: false,
            });
            console.log(
              `Stripe product ${mapping.stripeProductId} archived (cannot be deleted due to existing prices)`,
            );
          } catch (archiveError) {
            // 非アクティブ化にも失敗した場合
            console.error(
              `Failed to archive Stripe product ${mapping.stripeProductId}:`,
              archiveError,
            );
          }
        } else {
          // その他のエラーの場合
          console.error(
            `Failed to delete Stripe product ${mapping.stripeProductId}:`,
            deleteError,
          );
        }
        // Stripe削除/非アクティブ化に失敗しても、DB削除は続行（楽観的アプローチ）
      }
    }

    return await this.itemRepository.delete(id);
  }
}
