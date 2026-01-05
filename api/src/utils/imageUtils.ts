import * as path from 'path';

/**
 * サポートされている画像拡張子のリスト
 */
export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
] as const;

/**
 * サポートされている画像MIMEタイプのリスト
 */
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
] as const;

/**
 * 拡張子からMIMEタイプへのマッピング
 */
const EXTENSION_TO_MIME_TYPE: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

/**
 * ファイル名からMIMEタイプを取得する
 * @param filename ファイル名
 * @returns MIMEタイプ
 * @throws サポートされていない拡張子の場合
 */
export function getMimeTypeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeType = EXTENSION_TO_MIME_TYPE[ext];

  if (!mimeType) {
    throw new Error(`Unsupported image format: ${ext}`);
  }

  return mimeType;
}

/**
 * 拡張子がサポートされているかチェックする
 * @param extension 拡張子（.を含む）
 * @returns サポートされている場合true
 */
export function isAllowedExtension(extension: string): boolean {
  return ALLOWED_IMAGE_EXTENSIONS.includes(
    extension.toLowerCase() as (typeof ALLOWED_IMAGE_EXTENSIONS)[number],
  );
}

/**
 * MIMEタイプがサポートされているかチェックする
 * @param mimeType MIMEタイプ
 * @returns サポートされている場合true
 */
export function isAllowedMimeType(mimeType: string): boolean {
  return ALLOWED_IMAGE_MIME_TYPES.includes(
    mimeType as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
  );
}
