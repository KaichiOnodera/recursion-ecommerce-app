/**
 * リダイレクトパラメータとして許可されるパスの定義
 * セキュリティのため、オープンリダイレクト脆弱性を防止
 */

/**
 * リダイレクトパラメータとして許可されないパス（ブラックリスト）
 * 認証ページなど、リダイレクト先として不適切なパスを定義
 */
export const DISALLOWED_REDIRECT_PATHS: (string | RegExp)[] = [
  // 認証ページへのリダイレクトは無限ループを引き起こす可能性があるため禁止
  '/auth/user/login',
  '/auth/user/signup',
  '/auth/admin/login',
  '/auth/admin/signup',
];

/**
 * 指定されたパスがリダイレクト禁止パスかどうかを判定
 * @param path チェックするパス
 * @returns 禁止されている場合true
 */
export const isDisallowedRedirectPath = (path: string): boolean => {
  return DISALLOWED_REDIRECT_PATHS.some((pattern) => {
    if (typeof pattern === 'string') {
      return path === pattern;
    }
    return pattern.test(path);
  });
};

/**
 * 指定されたパスが許可されているかどうかを判定
 *
 * ルール:
 * 1. 内部パス（/で始まる）は基本的に許可
 * 2. ただし、ブラックリストに含まれるパスは拒否
 * 3. 外部URLはvalidateRedirectPathで既に拒否されている
 *
 * @param path チェックするパス
 * @returns 許可されている場合true
 */
export const isAllowedRedirectPath = (path: string): boolean => {
  // ブラックリストに含まれている場合は拒否
  if (isDisallowedRedirectPath(path)) {
    return false;
  }

  // 内部パス（/で始まる）は許可
  // 外部URLや危険なパスはvalidateRedirectPathで既に拒否されている
  return path.startsWith('/');
};
