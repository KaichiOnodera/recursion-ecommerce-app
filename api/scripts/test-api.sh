#!/usr/bin/env bash

set -euo pipefail

# .env.test を読み込んで jest を実行
# 引数があれば jest に渡す（例: npm run test:api -- api/tests/integration/items.spec.ts）
# 引数がなければ全テストを実行

if [ $# -eq 0 ]; then
  # 引数なし: 全テスト実行
  dotenv -e .env.test -- npx jest --runInBand --detectOpenHandles --passWithNoTests
else
  # 引数あり: 指定したテストのみ実行
  # npm run test:api -- api/tests/integration/items.spec.ts の形式で使用
  dotenv -e .env.test -- npx jest --runInBand --detectOpenHandles "$@"
fi

