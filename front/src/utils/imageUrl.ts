import { API_BASE_URL } from '../services/api/config';

/**
 * 画像URLを正しく処理する
 * 完全なURL（http:// または https:// で始まる）の場合はそのまま返す
 * 相対パスの場合は API_BASE_URL と結合する
 */
export const getImageUrl = (src: string | null | undefined): string | null => {
  if (!src) {
    return null;
  }

  // 完全なURLの場合はそのまま返す
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // 相対パスの場合は API_BASE_URL と結合
  return `${API_BASE_URL}${src}`;
};
