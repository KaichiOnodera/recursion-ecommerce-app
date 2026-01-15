export const RedirectReason = {
  // 認証関連
  AUTH_REQUIRED: 'AUTH_REQUIRED', // 401エラー時
  LOGIN_SUCCESS: 'LOGIN_SUCCESS', // ログイン成功後
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS', // ログアウト後
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS', // サインアップ成功後

  // アクション後
  RESIGNATION_SUCCESS: 'RESIGNATION_SUCCESS', // 退会後
  ORDER_COMPLETE: 'ORDER_COMPLETE', // 注文完了後

  // その他
  DEFAULT: 'DEFAULT', // デフォルト
} as const;

export type RedirectReasonType =
  (typeof RedirectReason)[keyof typeof RedirectReason];
