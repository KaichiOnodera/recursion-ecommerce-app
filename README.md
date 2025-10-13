# Recursion E-commerce App

フルスタックのeコマースアプリケーションです。

## アーキテクチャ

- **データベース**: MySQL 8.0 (Docker Compose)
- **APIサーバー**: Express.js + TypeScript (ポート8000)
- **フロントエンド**: React + TypeScript (ポート3000)

## セットアップ手順

### 1. データベースの起動

```bash
docker-compose up
```

**データベース接続情報:**
- ホスト: localhost
- ポート: 3306
- データベース: ecommerce
- ユーザー: user
- パスワード: password

### 2. APIサーバーのセットアップ

```bash
cd api
npm install
npm run dev
```

**APIサーバー**: http://localhost:8000

### 3. フロントエンドのセットアップ

```bash
cd front
npm install
npm start
```

**フロントエンド**: http://localhost:3000
