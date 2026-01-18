/**
 * リダイレクトサービス（非React環境用）
 * apiClient.tsなどのReactコンポーネント外で使用
 */
import { RedirectReason } from '../constants/redirectReasons';
import { redirectConfig, RedirectContext } from '../config/redirectConfig';
import { isGuestAccessiblePath } from '../constants/guestAccessiblePaths';

/**
 * 401エラー時のリダイレクト処理
 * @param currentPath 現在のパス
 */
export const handleAuthRequired = (currentPath: string): void => {
  // ゲスト閲覧可能ページの場合はリダイレクトしない
  if (isGuestAccessiblePath(currentPath)) {
    return;
  }

  const context: RedirectContext = { currentPath };
  const rule = redirectConfig[RedirectReason.AUTH_REQUIRED];
  const target =
    typeof rule.target === 'function' ? rule.target(context) : rule.target;

  // 非React環境なので、window.location.hrefを使用
  window.location.href = target;
};

/**
 * リダイレクトサービス
 */
export const redirectService = {
  handleAuthRequired,
};
