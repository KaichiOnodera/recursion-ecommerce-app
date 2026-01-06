/**
 * Jestのグローバルセットアップ・ティアダウン
 * テストスイート全体で実行されるセットアップとクリーンアップを定義する。
 */

import { teardownTestDatabase } from './src/tests/helpers/database';

// テストスイート全体が終了した後にデータベース接続を切断
afterAll(async () => {
  await teardownTestDatabase();
}, 30000);

