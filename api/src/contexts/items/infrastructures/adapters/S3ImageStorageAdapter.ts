import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { IImageStorageAdapter } from '../../domains/adapters/IImageStorageAdapter';
import { getMimeTypeFromFilename } from '../../../../utils/imageUtils';

export class S3ImageStorageAdapter implements IImageStorageAdapter {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(
    region: string,
    bucketName: string,
    accessKeyId: string,
    secretAccessKey: string,
  ) {
    this.bucketName = bucketName;
    this.region = region;

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /**
   * S3に画像をアップロードし、S3キーを返す
   * @param file 画像ファイルのBuffer
   * @param filename ファイル名（拡張子含む）
   * @param itemId 商品ID
   * @returns S3キー（例: items/1/filename.jpg）
   */
  async save(file: Buffer, filename: string, itemId: number): Promise<string> {
    const key = `items/${itemId}/${filename}`;

    try {
      // eslint-disable-next-line no-console
      console.log('S3 upload started:', {
        bucket: this.bucketName,
        key,
        region: this.region,
        fileSize: file.length,
        contentType:
          this.getContentType(filename) ?? 'application/octet-stream',
      });

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType:
          this.getContentType(filename) ?? 'application/octet-stream',
      });

      await this.s3Client.send(command);

      // eslint-disable-next-line no-console
      console.log('S3 upload succeeded:', {
        bucket: this.bucketName,
        key,
        url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`,
      });

      return key;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('S3 upload failed:', {
        bucket: this.bucketName,
        key,
        region: this.region,
        error: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : undefined,
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new Error(
        `Failed to upload image to S3: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * S3から画像を削除
   * @param filePath S3キー（例: items/1/filename.jpg）
   * @param _itemId 商品ID（未使用だがインターフェースの互換性のため）
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(filePath: string, _itemId: number): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    await this.s3Client.send(command);
  }

  /**
   * 画像の公開URLを取得
   * S3の直接URLを返す（バケットはpublicである必要がある）
   * @param filePath S3キー（例: items/1/filename.jpg）
   * @param _itemId 商品ID（未使用だがインターフェースの互換性のため）
   * @returns 画像の公開URL
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUrl(filePath: string, _itemId: number): string {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${filePath}`;
  }

  private getContentType(filename: string): string | null {
    try {
      return getMimeTypeFromFilename(filename);
    } catch {
      return null;
    }
  }
}
