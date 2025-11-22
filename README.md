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

### 2. APIサーバーのセットアップ

```bash
cd api
npm install
cp .env.example .env
```

### 3. データベースマイグレーションの実行

```bash
cd api
npx prisma migrate dev
```

### 4. APIサーバーの起動

```bash
npm run dev
```

**APIサーバー**: http://localhost:8000

### 5. フロントエンドのセットアップ・起動

```bash
cd front
npm install
npm start
```

**フロントエンド**: http://localhost:3000

## 開発者向け

### マイグレーション管理
- 既存のマイグレーションを適用: `npx prisma migrate dev`
- 新しいマイグレーションを作成: `npx prisma migrate dev --name <migration_name>`

### APIテスト
1. **テスト用データベースの起動**

```bash
cp .env.test.example .env.test
docker compose -f docker-compose.test.yml up -d db-test
```

2. **テスト環境のマイグレーション実行**

```bash
cd api
npm run migrate:test
```

3. **（オプション）テスト用シードデータの投入**

```bash
npm run seed:test
```

#### テストの実行

- **すべてのAPIテストを実行**

```bash
cd api
npm run test:api
```

- **特定のテストファイルのみ実行**

```bash
cd api
npm run test:api -- api/src/contexts/hoge/items.test.ts
```
