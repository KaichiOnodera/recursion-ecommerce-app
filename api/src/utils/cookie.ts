import express from 'express';

const CART_SESSION_ID_COOKIE_NAME = 'cart_session_id';
const CART_SESSION_ID_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7日（ミリ秒）

/**
 * cart_session_idをCookieに設定する
 * @param res Express Responseオブジェクト
 * @param sessionId 設定するsessionId
 */
export const setCartSessionIdCookie = (
  res: express.Response,
  sessionId: string,
): void => {
  res.cookie(CART_SESSION_ID_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: CART_SESSION_ID_MAX_AGE,
    path: '/',
  });
};

/**
 * cart_session_idをCookieから削除する
 * @param res Express Responseオブジェクト
 */
export const clearCartSessionIdCookie = (res: express.Response): void => {
  res.clearCookie(CART_SESSION_ID_COOKIE_NAME, {
    path: '/',
  });
};

/**
 * Cookieからcart_session_idを取得する
 * @param req Express Requestオブジェクト
 * @returns sessionId（存在しない場合はundefined）
 */
export const getCartSessionIdFromCookie = (
  req: express.Request,
): string | undefined => {
  return req.cookies?.[CART_SESSION_ID_COOKIE_NAME];
};
