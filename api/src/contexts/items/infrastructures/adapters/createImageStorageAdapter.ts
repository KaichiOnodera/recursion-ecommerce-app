import * as path from 'path';
import { IImageStorageAdapter } from '../../domains/adapters/IImageStorageAdapter';
import { LocalImageStorageAdapter } from './LocalImageStorageAdapter';
import { S3ImageStorageAdapter } from './S3ImageStorageAdapter';

/**
 * 環境変数に基づいて適切な画像ストレージアダプターを作成する
 * @returns IImageStorageAdapterのインスタンス
 * @throws S3設定が不完全な場合にエラーを投げる
 */
export function createImageStorageAdapter(): IImageStorageAdapter {
  const storageType = process.env.STORAGE_TYPE ?? 'local';

  if (storageType === 's3') {
    const region = process.env.AWS_REGION;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;

    if (!region || !bucketName || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'S3 configuration is incomplete. Please set AWS_REGION, AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY environment variables.',
      );
    }

    return new S3ImageStorageAdapter(
      region,
      bucketName,
      accessKeyId,
      secretAccessKey,
      cloudFrontDomain,
    );
  }

  const uploadDir = path.join(process.cwd(), 'uploads', 'items');
  return new LocalImageStorageAdapter(uploadDir);
}
