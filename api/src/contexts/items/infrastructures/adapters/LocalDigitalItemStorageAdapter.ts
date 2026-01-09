import * as path from 'path';
import { promises as fs } from 'fs';
import { IDigitalItemStorageAdapter } from '../../domains/adapters/IDigitalItemStorageAdapter';

export class LocalDigitalItemStorageAdapter
  implements IDigitalItemStorageAdapter
{
  private readonly uploadDir: string;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
  }

  /**
   * zipをローカルに保存して「filePath（storageKey）」を返す
   * 例: digital/items/42/product.zip
   */
  async save(file: Buffer, filename: string, itemId: number): Promise<string> {
    // 拡張子チェック（zipのみ許可）
    const ext = path.extname(filename).toLowerCase();
    if (ext !== '.zip') {
      throw new Error('Digital item must be a zip file');
    }

    // DBに保存する filePath（storageKey）を作る（uploadDirを含めない）
    const filePath = path.join('digital', 'items', itemId.toString(), filename);

    // 実際の保存先（絶対パス）
    const fullPath = path.join(this.uploadDir, filePath);

    // ディレクトリ作成
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // 書き込み
    await fs.writeFile(fullPath, file);

    return filePath;
  }

  /**
   * ローカルから削除
   * filePath は save() で返した値をそのまま渡す想定
   */
  async delete(filePath: string, itemId: number): Promise<void> {
    const normalized = filePath.replace(/\\/g, '/');
    if (!normalized.startsWith(`digital/items/${itemId}/`)) {
      throw new Error('Invalid filePath for the itemId');
    }

    const fullPath = path.join(this.uploadDir, filePath);
    await fs.unlink(fullPath);
  }

  getUrl(filePath: string, itemId: number): string {
    const normalized = filePath.replace(/\\/g, '/');
    if (!normalized.startsWith(`digital/items/${itemId}/`)) {
      throw new Error('Invalid filePath for the itemId');
    }

    return `/static/${normalized}`;
  }
}
