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
  private readonly cloudFrontDomain?: string;

  constructor(
    region: string,
    bucketName: string,
    accessKeyId: string,
    secretAccessKey: string,
    cloudFrontDomain?: string,
  ) {
    this.bucketName = bucketName;
    this.region = region;
    this.cloudFrontDomain = cloudFrontDomain;

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

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: this.getContentType(filename) ?? 'application/octet-stream',
    });

    await this.s3Client.send(command);

    return key;
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
   * CloudFrontが設定されている場合はCloudFrontのURLを返す
   * それ以外の場合はS3の直接URLを返す（バケットはpublicである必要がある）
   * @param filePath S3キー（例: items/1/filename.jpg）
   * @param _itemId 商品ID（未使用だがインターフェースの互換性のため）
   * @returns 画像の公開URL
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUrl(filePath: string, _itemId: number): string {
    if (this.cloudFrontDomain) {
      return `https://${this.cloudFrontDomain}/${filePath}`;
    }

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
