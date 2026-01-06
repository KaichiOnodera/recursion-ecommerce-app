# ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

# ルートのpackage.jsonとpackage-lock.jsonをコピー
COPY package.json package-lock.json ./

# sharedディレクトリをコピー（package.json含む）
COPY shared ./shared

# フロントエンドのpackage.jsonをコピー
COPY front/package*.json ./front/

# ルートでnpm ciを実行（すべてのworkspaceをインストール）
# --ignore-scripts: huskyなどのスクリプトをスキップ（Docker内では不要）
RUN npm ci --ignore-scripts

# sharedディレクトリをビルド
WORKDIR /app/shared
RUN npx tsc

# フロントエンドディレクトリに移動
WORKDIR /app/front

# フロントエンドのソースコードをコピー
COPY front/ ./

# ビルド
RUN npm run build

# 本番ステージ（Nginxでイメージを使用）
FROM nginx:alpine

# ビルド成果物をコピー
COPY --from=builder /app/front/build /usr/share/nginx/html

# Nginx設定をコピー
COPY front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
