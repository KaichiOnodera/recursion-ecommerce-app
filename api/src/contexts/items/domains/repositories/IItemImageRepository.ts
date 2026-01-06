import { ItemImage } from '../entities/ItemImage';

export interface IItemImageRepository {
  /**
   * 商品IDで画像一覧を取得（order順でソート）
   * @param itemId 商品ID
   * @returns 画像一覧
   */
  findByItemId(itemId: number): Promise<ItemImage[]>;

  /**
   * 画像レコードを作成
   * @param itemId 商品ID
   * @param src 画像のパス（またはS3キー）
   * @param order 表示順序
   * @returns 作成された画像レコード
   */
  create(itemId: number, src: string, order: number): Promise<ItemImage>;

  /**
   * 画像レコードを削除
   * @param id 画像ID
   * @returns 削除成功したかどうか
   */
  delete(id: number): Promise<boolean>;

  /**
   * 画像の順序を変更
   * @param id 画像ID
   * @param order 新しい順序
   * @returns 更新された画像レコード
   */
  updateOrder(id: number, order: number): Promise<ItemImage>;

  /**
   * 商品の画像の最大orderを取得（新規アップロード時のorder計算用）
   * @param itemId 商品ID
   * @returns 最大order（画像がない場合は0）
   */
  getMaxOrder(itemId: number): Promise<number>;

  /**
   * 商品の画像枚数を取得（最大枚数チェック用）
   * @param itemId 商品ID
   * @returns 画像枚数
   */
  countByItemId(itemId: number): Promise<number>;

  /**
   * 画像IDで画像を取得
   * @param id 画像ID
   * @returns 画像レコード（存在しない場合はnull）
   */
  findById(id: number): Promise<ItemImage | null>;
}
