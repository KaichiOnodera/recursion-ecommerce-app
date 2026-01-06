# ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係をコピーしてインストール
COPY package*.json ./
RUN npm ci

# ソースコードをコピーしてビルド
COPY . .
RUN npm run build

# 本番ステージ（Nginxでイメージを使用）
FROM nginx:alpine

# ビルド成果物をコピー
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx設定をコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
