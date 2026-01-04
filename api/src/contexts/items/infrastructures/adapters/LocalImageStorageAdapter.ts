import * as fs from 'fs/promises';
import * as path from 'path';
import { IImageStorageAdapter } from '../../domains/adapters/IImageStorageAdapter';

export class LocalImageStorageAdapter implements IImageStorageAdapter {
  private readonly uploadDir: string;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
  }

  async save(file: Buffer, filename: string, itemId: number): Promise<string> {
    const itemDir = path.join(this.uploadDir, itemId.toString());
    const filePath = path.join(itemDir, filename);

    // ディレクトリが存在しない場合は作成
    await fs.mkdir(itemDir, { recursive: true });

    // ファイルを保存
    await fs.writeFile(filePath, file);

    // 相対パスを返す（データベースに保存する値）
    return path.join(itemId.toString(), filename);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(filePath: string, _itemId: number): Promise<void> {
    const fullPath = path.join(this.uploadDir, filePath);

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      // ファイルが存在しない場合はエラーを無視
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUrl(filePath: string, _itemId: number): string {
    // エンドポイント経由のURLを返す
    // filePathは "itemId/filename" 形式なので、itemIdを抽出
    const pathParts = filePath.split(path.sep);
    const actualItemId = pathParts[0];
    const filename = pathParts[pathParts.length - 1];
    return `/images/items/${actualItemId}/${filename}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getFile(filePath: string, _itemId: number): Promise<Buffer> {
    const fullPath = path.join(this.uploadDir, filePath);

    try {
      return await fs.readFile(fullPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Image file not found: ${filePath}`);
      }
      throw error;
    }
  }
}
