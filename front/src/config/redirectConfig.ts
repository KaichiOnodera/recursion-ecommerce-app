/**
 * リダイレクト設定の一元管理
 * コードから挙動を追えるように、すべてのリダイレクトルールをここに定義
 */
import {
  RedirectReason,
  RedirectReasonType,
} from '../constants/redirectReasons';

export interface RedirectRule {
  // リダイレクト先のパス（関数で動的に決定可能）
  target: string | ((context?: RedirectContext) => string);
  // リダイレクト方法（replace or push）
  method?: 'replace' | 'push';
  // 説明（コードから挙動を理解するため）
  description: string;
}

export interface RedirectContext {
  // 現在のパス
  currentPath?: string;
  // ユーザー情報
  userRole?: 'USER' | 'ADMIN';
  // 追加のコンテキスト（将来の拡張用）
  [key: string]: any;
}

/**
 * リダイレクト設定マップ
 * 新しいリダイレクト理由を追加する場合は、ここに設定を追加するだけ
 */
export const redirectConfig: Record<RedirectReasonType, RedirectRule> = {
  // 403エラー時: 現在のパスを保存してログインページへ
  [RedirectReason.AUTH_REQUIRED]: {
    target: (context) => {
      const currentPath = context?.currentPath || '/products';
      const loginPath = currentPath.startsWith('/admin')
        ? '/auth/admin/login'
        : '/auth/user/login';
      return `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
    },
    method: 'replace',
    description:
      '認証が必要なページで403エラーが発生した場合、ログインページへリダイレクト',
  },

  // ログイン成功後: redirectパラメータがあればそこへ、なければデフォルト
  [RedirectReason.LOGIN_SUCCESS]: {
    target: '/products', // デフォルト（redirectパラメータは別途処理）
    method: 'replace',
    description:
      'ログイン成功後、redirectパラメータがあればそこへ、なければ商品一覧へ',
  },

  // サインアップ成功後
  [RedirectReason.SIGNUP_SUCCESS]: {
    target: '/products',
    method: 'replace',
    description: 'サインアップ成功後、商品一覧へ',
  },

  // ログアウト後
  [RedirectReason.LOGOUT_SUCCESS]: {
    target: '/auth/user/login',
    method: 'replace',
    description: 'ログアウト後、ログインページへ',
  },

  // 退会後
  [RedirectReason.RESIGNATION_SUCCESS]: {
    target: '/products',
    method: 'replace',
    description: '退会後、商品一覧へ',
  },

  // 注文完了後
  [RedirectReason.ORDER_COMPLETE]: {
    target: '/order/complete',
    method: 'replace',
    description: '注文完了後、完了ページへ',
  },

  // デフォルト
  [RedirectReason.DEFAULT]: {
    target: '/products',
    method: 'replace',
    description: 'デフォルトのリダイレクト先',
  },
};
