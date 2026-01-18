import { isAllowedRedirectPath } from '../constants/allowedRedirectPaths';

/**
 * リダイレクトパラメータの検証
 * セキュリティのため、オープンリダイレクト脆弱性を防止
 */

/**
 * パスが安全なリダイレクト先かどうかを検証
 * @param path 検証するパス
 * @returns 安全な場合true
 */
export const validateRedirectPath = (
  path: string | null | undefined,
): boolean => {
  // null/undefinedの場合は無効
  if (!path || typeof path !== 'string') {
    return false;
  }

  // 空文字列は無効
  if (path.trim() === '') {
    return false;
  }

  // 単一のスラッシュで始まらない場合は無効（外部URLを拒否）
  if (!path.startsWith('/')) {
    return false;
  }

  // ダブルスラッシュで始まる場合は無効（//evil.com のような攻撃を防ぐ）
  if (path.startsWith('//')) {
    return false;
  }

  // 危険なプロトコルをチェック
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
  const lowerPath = path.toLowerCase();
  if (dangerousProtocols.some((protocol) => lowerPath.startsWith(protocol))) {
    return false;
  }

  // URLとしてパースして、originが現在のoriginと一致するかチェック
  try {
    const parsed = new URL(path, window.location.origin);
    // originが現在のoriginと一致しない場合は無効（外部URLを拒否）
    if (parsed.origin !== window.location.origin) {
      return false;
    }
  } catch {
    // URLとしてパースできない場合は無効
    return false;
  }

  // ホワイトリストに含まれているかチェック
  return isAllowedRedirectPath(path);
};

/**
 * URLからredirectパラメータを安全に取得
 * @param searchParams URLSearchParamsオブジェクト
 * @returns 検証済みのリダイレクトパス、またはnull
 */
export const getSafeRedirectPath = (
  searchParams: URLSearchParams,
): string | null => {
  const redirectParam = searchParams.get('redirect');
  if (validateRedirectPath(redirectParam)) {
    return redirectParam!;
  }
  return null;
};
