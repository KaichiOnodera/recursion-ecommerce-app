/**
 * ゲスト（未ログイン）ユーザーが閲覧可能なパスの定義
 * これらのパスで401エラーが発生した場合、ログインページにリダイレクトしない
 */
export const GUEST_ACCESSIBLE_PATHS: (string | RegExp)[] = [
  '/products',
  /^\/products\/\d+$/, // /products/:id
  // 認証ページは401エラーが発生してもリダイレクトしない（無限ループ防止）
  '/auth/user/login',
  '/auth/user/signup',
  '/auth/admin/login',
  '/auth/admin/signup',
];

/**
 * 指定されたパスがゲスト閲覧可能かどうかを判定
 * @param path チェックするパス
 * @returns ゲスト閲覧可能な場合true
 */
export const isGuestAccessiblePath = (path: string): boolean => {
  return GUEST_ACCESSIBLE_PATHS.some((pattern) => {
    if (typeof pattern === 'string') {
      return path === pattern;
    }
    return pattern.test(path);
  });
};
