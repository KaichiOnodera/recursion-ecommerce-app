import express, { RequestHandler, Router } from 'express';

/**
 * コントローラーからExpressルーターを作成する
 *
 * @param method - HTTPメソッド
 * @param path - ルーター内のパス（例: '/' または '/:id'）
 * @param controller - コントローラーインスタンス
 * @param middlewares - オプション: ミドルウェアの配列
 * @returns 作成されたルーター
 *
 * @example
 * ```typescript
 * import { createRouter } from '../helpers/router';
 *
 * // パスパラメータなし
 * const router = createRouter('GET', '/', controller);
 *
 * // パスパラメータあり
 * const router = createRouter('PATCH', '/:id', controller);
 *
 * // ミドルウェア付き
 * const router = createRouter('POST', '/', controller, [verifyAccessToken, verifyAdmin]);
 * ```
 */
export function createRouter(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controller: { execute: (...args: any[]) => any },
  middlewares?: Array<RequestHandler>,
): Router {
  const router = express.Router();

  if (middlewares) {
    router.use(...middlewares);
  }

  const methodLower = method.toLowerCase() as Lowercase<typeof method>;
  router[methodLower](
    path,
    controller.execute.bind(controller) as RequestHandler,
  );

  return router;
}
