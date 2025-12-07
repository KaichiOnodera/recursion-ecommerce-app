import express, { Router } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

/**
 * テスト用のExpressアプリを作成する
 *
 * @param routers - ルーターの配列。各要素は { path: string, router: Router } の形式
 * @returns 設定済みのExpressアプリ
 *
 * @example
 * ```typescript
 * import { createTestApp } from '../helpers/app';
 * import { createRouter } from '../helpers/router';
 *
 * const itemsRouter = createRouter('GET', '/', controller);
 * const app = createTestApp([
 *   { path: '/items', router: itemsRouter },
 * ]);
 * ```
 */
export function createTestApp(
  routers: Array<{ path: string; router: Router }>,
) {
  const app = express();

  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  for (const { path, router } of routers) {
    app.use(path, router);
  }

  return app;
}
