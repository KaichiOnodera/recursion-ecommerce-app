export interface IImageStorageAdapter {
  /**
   * 画像ファイルを保存し、保存先のパス（またはキー）を返す
   * @param file 画像ファイルのBuffer
   * @param filename ファイル名（拡張子含む）
   * @param itemId 商品ID
   * @returns 保存先のパス（ローカルの場合）またはS3キー
   */
  save(file: Buffer, filename: string, itemId: number): Promise<string>;

  /**
   * 画像ファイルを削除
   * @param filePath 保存時のパス（またはS3キー）
   * @param itemId 商品ID
   */
  delete(filePath: string, itemId: number): Promise<void>;

  /**
   * 画像の公開URLを取得（エンドポイント経由のURL）
   * ローカル・S3問わず、認証チェック付きエンドポイントのURLを返す
   * @param filePath 保存時のパス（またはS3キー）
   * @param itemId 商品ID
   * @returns エンドポイント経由のURL（例: /images/items/1/filename.jpg）
   */
  getUrl(filePath: string, itemId: number): string;

  /**
   * 画像ファイルを取得（エンドポイント経由配信用）
   * @param filePath 保存時のパス（またはS3キー）
   * @param itemId 商品ID
   * @returns 画像ファイルのBuffer
   */
  getFile(filePath: string, itemId: number): Promise<Buffer>;
}
