# ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

# ルートのpackage.jsonとpackage-lock.jsonをコピー
COPY package.json package-lock.json ./

# sharedディレクトリをコピー（package.json含む）
COPY shared ./shared

# APIのpackage.jsonをapi/ディレクトリにコピー
COPY api/package*.json ./api/

# Prismaスキーマをコピー
COPY api/prisma ./api/prisma

# ルートでnpm ciを実行（すべてのworkspaceをインストール）
# --ignore-scripts: huskyなどのスクリプトをスキップ（Docker内では不要）
RUN npm ci --ignore-scripts

# sharedディレクトリをビルド
WORKDIR /app/shared
RUN npx tsc

# APIディレクトリに移動
WORKDIR /app/api

# APIのソースコードをコピー（現在のディレクトリに直接）
COPY api/ ./
RUN npx prisma generate
RUN npm run build

# 本番ステージ
FROM node:20-alpine

WORKDIR /app

# ルートのpackage.jsonとpackage-lock.jsonをコピー
COPY package.json package-lock.json ./

# sharedディレクトリをコピー
COPY shared ./shared

# APIのpackage.jsonをコピー
COPY api/package*.json ./api/

# ルートで本番用の依存関係のみインストール（すべてのworkspaceをインストール）
# --ignore-scripts: huskyなどのスクリプトをスキップ（Docker内では不要）
RUN npm ci --only=production --ignore-scripts

# ビルド成果物をコピー
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/api/prisma ./api/prisma
COPY --from=builder /app/shared/dist ./shared/dist

# APIディレクトリに移動してPrismaクライアントを生成
WORKDIR /app/api
RUN npx prisma generate

EXPOSE 8000

CMD ["npm", "start"]
