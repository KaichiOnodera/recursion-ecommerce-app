/**
 * Jestのグローバルセットアップ・ティアダウン
 * テストスイート全体で実行されるセットアップとクリーンアップを定義する。
 */

import {
  setupTestDatabase,
  teardownTestDatabase,
} from './src/tests/helpers/database';

// テストスイート全体で1回だけseedを実行
beforeAll(async () => {
  await setupTestDatabase();
}, 30000);

// テストスイート全体が終了した後にデータベース接続を切断
afterAll(async () => {
  await teardownTestDatabase();
}, 30000);

