# 商品画像管理機能 設計書

## 1. 概要

管理者が商品画像をアップロード・管理し、商品一覧画面と詳細画面で表示する機能を実装する。

## 2. 要件

- 1商品に対して最大10枚の画像を設定可能
- 一般的な画像拡張子に対応（jpg, jpeg, png, gif, webp, svg, avif）
- 画像サイズの制限なし（推奨サイズは表示）
- 管理者が画像の追加・削除・順序変更が可能
- 商品一覧画面では最初の画像（order=1）を表示
- 商品詳細画面では全画像をカルーセル形式で表示
- orderは1が一番手前で、それ以降インクリメント（1, 2, 3...）
- 初期実装はローカルファイルシステム、将来的にAWS S3に移行可能な設計

## 3. データベース設計

### 3.1 既存スキーマ

`ItemImages`テーブルは既に存在：

```prisma
model ItemImages {
  id        Int      @id @default(autoincrement())
  itemId    Int
  src       String   // 画像のURLまたはパス
  order     Int      @default(0)  // 表示順序（1が一番手前）
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  item Items @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@index([itemId])
}
```

### 3.2 スキーマ変更

**必須変更**: `onDelete: Cascade`に変更（商品削除時に画像も自動削除）

**注意**: `order`のデフォルト値は0だが、実装時は1から開始する。既存データとの互換性のため、デフォルト値は0のまま。

### 3.3 スキーマ拡張の検討（将来）

- `alt`フィールド追加（アクセシビリティ対応、オプション）
- `isMain`フィールド追加（メイン画像の明示的な指定、オプション）
  - 現状は`order=1`をメイン画像として扱う

**推奨**: 現時点では既存スキーマで実装し、必要に応じて後で拡張。

## 4. 画像保存方法

### 4.1 保存先の選択

**Phase 1（初期実装）**: ローカルファイルシステム

- 開発・検証が容易
- `public/uploads/items/` ディレクトリに保存
- ファイル名: `{itemId}_{timestamp}_{random}.{ext}`

**Phase 2（本番対応）**: AWS S3

- スケーラビリティと可用性の向上
- CDNとの連携が容易
- 実装はアダプターパターンで切り替え可能に設計
- 環境変数で切り替え可能（`IMAGE_STORAGE_TYPE=local|s3`）

### 4.1.1 ストレージアダプター設計

`IImageStorageAdapter`インターフェースを定義し、実装を切り替え可能にする：

```typescript
interface IImageStorageAdapter {
  /**
   * 画像ファイルを保存し、保存先のパス（またはキー）を返す
   * @param file 画像ファイルのBuffer
   * @param filename ファイル名（拡張子含む）
   * @param itemId 商品ID
   * @returns 保存先のパス（ローカルの場合）またはS3キー
   */
  save(file: Buffer, filename: string, itemId: number): Promise<string>;
  
  /**
   * 画像ファイルを削除
   * @param filePath 保存時のパス（またはS3キー）
   * @param itemId 商品ID
   */
  delete(filePath: string, itemId: number): Promise<void>;
  
  /**
   * 画像の公開URLを取得（エンドポイント経由のURL）
   * ローカル・S3問わず、認証チェック付きエンドポイントのURLを返す
   * @param filePath 保存時のパス（またはS3キー）
   * @param itemId 商品ID
   * @returns エンドポイント経由のURL（例: /images/items/1/filename.jpg）
   */
  getUrl(filePath: string, itemId: number): string;
  
  /**
   * 画像ファイルを取得（エンドポイント経由配信用）
   * @param filePath 保存時のパス（またはS3キー）
   * @param itemId 商品ID
   * @returns 画像ファイルのBuffer
   */
  getFile(filePath: string, itemId: number): Promise<Buffer>;
}
```

**実装クラス**:

1. **LocalImageStorageAdapter**
   - `save()`: `uploads/items/{itemId}/{filename}` に保存（`public`の外）
   - `delete()`: ファイルシステムから削除
   - `getUrl()`: `/images/items/{itemId}/{filename}` を返す（配信エンドポイントのURL）

2. **S3ImageStorageAdapter**（将来実装）
   - `save()`: S3バケットの `items/{itemId}/{filename}` にアップロード（**プライベートバケット**）
   - `delete()`: S3からオブジェクトを削除
   - `getUrl()`: `/images/items/{itemId}/{filename}` を返す（**エンドポイント経由のURL**）
   - `getFile()`: S3から画像ファイルを取得（エンドポイント経由配信用）

   **重要**: S3でも同じ認証チェック機構を使用するため、`getUrl()`はエンドポイントのURLを返す。
   S3バケットは**プライベート**に設定し、直接アクセスを不可にする。

**DI設定**:

```typescript
// api/src/contexts/items/admin/index.ts
const storageType = process.env.IMAGE_STORAGE_TYPE || 'local';

const imageStorageAdapter: IImageStorageAdapter = 
  storageType === 's3' 
    ? new S3ImageStorageAdapter({
        bucket: process.env.S3_BUCKET_NAME!,
        region: process.env.AWS_REGION!,
        // CloudFront URLがあれば設定
        cloudFrontUrl: process.env.CLOUDFRONT_URL,
      })
    : new LocalImageStorageAdapter({
        // publicの外に保存（セキュリティのため）
        uploadDir: path.join(process.cwd(), 'uploads', 'items'),
      });
```

**環境変数**:

```env
# ストレージタイプ: 'local' または 's3'
IMAGE_STORAGE_TYPE=local

# S3設定（IMAGE_STORAGE_TYPE=s3の場合に必要）
S3_BUCKET_NAME=your-bucket-name
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net  # オプション
```

**移行時の注意点**:

- 既存のローカルファイルをS3に移行するスクリプトが必要
- データベースの`src`フィールドの値は変更不要（エンドポイント経由のURLのため）
- S3バケットをプライベートに設定（直接アクセス不可）
- ローカルとS3の両方に対応する期間を設ける（段階的移行）

**S3でも同じ認証チェック機構を使用**:

- `getUrl()`は常にエンドポイント経由のURL（`/images/items/:itemId/:filename`）を返す
- エンドポイントで認証チェック後、`getFile()`でS3から画像を取得して配信
- これにより、ローカル・S3問わず同じセキュリティポリシーを適用可能

### 4.2 ファイル命名規則

```
{itemId}_{timestamp}_{randomString}.{ext}
例: 1_1704067200000_a3f9b2c.jpg
```

- `itemId`: 商品ID
- `timestamp`: アップロード時刻（ミリ秒）
- `randomString`: ランダム文字列（8文字）
- `ext`: 元のファイル拡張子

### 4.3 ディレクトリ構造

**重要**: セキュリティのため、画像は`public`ディレクトリの**外**に保存する。

```
api/
  uploads/          # publicの外に配置
    items/
      {itemId}/
        1_1704067200000_a3f9b2c.jpg
        1_1704067201000_b4c5d6e.png
```

画像へのアクセスは専用のエンドポイント経由のみとし、直接ファイルアクセスは不可にする。

## 5. API設計

### 5.1 エンドポイント一覧

#### 5.1.1 画像アップロード（管理者用）

```
POST /admin/items/:id/images
Content-Type: multipart/form-data

Request Body:
  - images: File[] (複数ファイル対応)

Response:
{
  "images": [
    {
      "id": 1,
      "itemId": 1,
      "src": "/uploads/items/1/1_1704067200000_a3f9b2c.jpg",
      "order": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**注意**:

- アップロード時に既存画像の最大orderを取得し、+1した値を設定
- 最初の画像は`order=1`から開始
- 最大10枚まで（既に10枚ある場合は400エラー）

```

#### 5.1.2 画像削除（管理者用）

```

DELETE /admin/items/:id/images/:imageId

Response:
{
  "message": "Image deleted successfully"
}

```

#### 5.1.3 画像順序変更（管理者用）

```

PATCH /admin/items/:id/images/:imageId
Content-Type: application/json

Request Body:
{
  "order": 2
}

Response:
{
  "image": {
    "id": 1,
    "itemId": 1,
    "src": "/uploads/items/1/1_1704067200000_a3f9b2c.jpg",
    "order": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}

```

#### 5.1.4 画像配信エンドポイント（認証チェック付き）

```

GET /images/items/:itemId/:filename

```

**認証・認可チェック**:
- 商品の`displayStatus`が`public`の場合: 全ユーザーがアクセス可能
- 商品の`displayStatus`が`private`の場合: 管理者のみアクセス可能
- 商品が存在しない場合: 404 Not Found

**Response**:
- Content-Type: 画像のMIMEタイプ
- Body: 画像ファイルのバイナリデータ

**例**:
```

GET /images/items/1/1_1704067200000_a3f9b2c.jpg
→ 商品1がpublicなら200 OK、privateなら管理者のみ200 OK、それ以外は403 Forbidden

```

**注意**: 
- `src`フィールドにはこのエンドポイントのURLを返す
- 例: `/images/items/1/1_1704067200000_a3f9b2c.jpg`

#### 5.1.5 商品取得時の画像情報を含める

既存のエンドポイントを拡張：

```

GET /items/:id
GET /items
GET /admin/items/:id
GET /admin/items

```

Responseに`images`フィールドを追加：

```typescript
{
  "item": {
    "id": 1,
    "name": "商品名",
    "description": "説明",
    "price": 1000,
    "inventoryStatus": "inStock",
    "images": [
      {
        "id": 1,
        "src": "/images/items/1/1_1704067200000_a3f9b2c.jpg",
        "order": 1
      },
      {
        "id": 2,
        "src": "/images/items/1/1_1704067201000_b4c5d6e.png",
        "order": 2
      }
    ]
  }
}
```

### 5.2 バリデーション

#### 5.2.1 ファイル形式

許可する拡張子:

- `.jpg`, `.jpeg`
- `.png`
- `.gif`
- `.webp`
- `.svg`
- `.avif`

MIMEタイプでの検証も実施:

- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`
- `image/svg+xml`
- `image/avif`

#### 5.2.2 ファイルサイズ

- 制限なし（要件通り）
- ただし、推奨サイズをレスポンスに含める
- サーバー側で警告ログを出力（オプション）

#### 5.2.3 その他

- 商品IDの存在確認
- 管理者権限の確認（既存の`verifyAdmin`ミドルウェアを使用）
- **最大枚数チェック**: 1商品あたり最大10枚まで（既に10枚ある場合は400エラー）
- **orderの自動設定**: アップロード時に既存画像の最大orderを取得し、+1した値を設定（最初は1）

## 6. 実装設計

### 6.1 バックエンド実装

#### 6.1.1 ディレクトリ構造

```
api/src/contexts/items/
  admin/
    controllers/
      UploadItemImagesController.ts  # 新規
      DeleteItemImageController.ts   # 新規
      UpdateItemImageOrderController.ts  # 新規
    interactors/
      UploadItemImagesInteractor.ts  # 新規
      DeleteItemImageInteractor.ts   # 新規
      UpdateItemImageOrderInteractor.ts  # 新規
    usecases/
      IUploadItemImagesInteractor.ts  # 新規
      IDeleteItemImageInteractor.ts   # 新規
      IUpdateItemImageOrderInteractor.ts  # 新規
  controllers/
    GetItemImageController.ts  # 新規（画像配信用）
  interactors/
    GetItemImageInteractor.ts  # 新規（画像配信用）
  usecases/
    IGetItemImageInteractor.ts  # 新規（画像配信用）
  infrastructures/
    repositories/
      ItemImageRepository.ts  # 新規
    adapters/
      IImageStorageAdapter.ts  # 新規（将来のS3対応用）
      LocalImageStorageAdapter.ts  # 新規
  domains/
    repositories/
      IItemImageRepository.ts  # 新規
    entities/
      ItemImage.ts  # 新規
```

#### 6.1.2 主要な実装ポイント

**ImageStorageAdapter（アダプター）**

- 画像保存の抽象化
- ローカルストレージとS3の切り替えが可能
- インターフェース: `save()`, `delete()`, `getUrl()`
- 環境変数`IMAGE_STORAGE_TYPE`で実装を切り替え
- DIコンテナで適切なアダプターを注入
- 実装例:

  ```typescript
  // LocalImageStorageAdapter: public/uploads/items/{itemId}/ に保存
  // S3ImageStorageAdapter: s3://bucket-name/items/{itemId}/ に保存
  ```

**ItemImageRepository**

- `ItemImages`テーブルの操作
- `findByItemId()`: 商品IDで画像一覧を取得（order順でソート）
- `create()`: 画像レコードを作成（orderは自動計算）
- `delete()`: 画像レコードとファイルを削除
- `updateOrder()`: 画像の順序を変更
- `getMaxOrder()`: 商品の画像の最大orderを取得（新規アップロード時のorder計算用）
- `countByItemId()`: 商品の画像枚数を取得（最大枚数チェック用）

**GetItemImageInteractor（画像配信用）**

- 商品の存在確認と`displayStatus`のチェック
- 管理者権限のチェック（`displayStatus=private`の場合）
- `ImageStorageAdapter`の`getFile()`を使用して画像ファイルを取得
  - ローカルの場合: ファイルシステムから読み込み
  - S3の場合: S3からダウンロード
- 画像ファイルの配信（streamまたはBuffer）
- 適切な`Content-Type`ヘッダーの設定
- エラーハンドリング（404, 403, 500）

**重要**: ローカル・S3問わず、同じエンドポイント（`GET /images/items/:itemId/:filename`）経由で配信し、同じ認証チェック機構を使用する。

**既存のItemRepository拡張**

- `findById()`, `findAll()`, `find()`で`ItemImages`をinclude
- レスポンスに画像情報を含める

**ファイルアップロード処理**

- `multer`ミドルウェアを使用
- ファイル検証（拡張子、MIMEタイプ）
- ファイル名の生成と保存

### 6.2 フロントエンド実装

#### 6.2.1 スキーマ拡張

`shared/schemas/item.ts`に画像型を追加:

```typescript
export type ItemImage = {
  id: number;
  src: string;
  order: number;
};

export type Item = {
  // ... 既存フィールド
  images?: ItemImage[];
};
```

#### 6.2.2 コンポーネント

**管理者画面**

- `ImageUploader.tsx`: 画像アップロードUI（ドラッグ&ドロップ対応）
- `ImageList.tsx`: 画像一覧表示と削除・順序変更
- `AdminProductEdit.tsx`: 既存の編集画面に画像管理セクションを追加

**一般ユーザー画面**

- `ProductImageCarousel.tsx`: 商品詳細画面用の画像カルーセル（order順で表示）
- `ProductCard.tsx`: 商品一覧用の画像表示（order=1の画像、なければプレースホルダー）

#### 6.2.3 APIクライアント

`front/src/services/api/items.ts`に追加:

```typescript
export async function uploadItemImages(
  itemId: number,
  files: File[]
): Promise<{ images: ItemImage[] }>;

export async function deleteItemImage(
  itemId: number,
  imageId: number
): Promise<void>;

export async function updateItemImageOrder(
  itemId: number,
  imageId: number,
  order: number
): Promise<{ image: ItemImage }>;
```

## 7. セキュリティ考慮事項

### 7.1 ファイルアップロード

- ファイル拡張子のホワイトリスト検証
- MIMEタイプの検証（拡張子だけでは不十分）
- ファイル名のサニタイズ（パストラバーサル対策）
- ファイルサイズの監視（DoS対策、ログ出力）

### 7.2 アクセス制御

- 管理者権限の確認（既存の`verifyAdmin`ミドルウェア）
- 商品IDの存在確認
- 画像IDと商品IDの整合性確認

### 7.3 ファイル公開とアクセス制御

**必須実装**: 画像は静的ファイルとして公開せず、専用のエンドポイントで認証チェック後に配信する。

**実装方針**:

1. 画像を`public`ディレクトリの外（`uploads/items/`）に保存
2. `GET /images/items/:itemId/:filename`エンドポイントを作成
3. エンドポイントで以下をチェック:
   - 商品の存在確認
   - 商品の`displayStatus`が`public`なら全ユーザーアクセス可能
   - 商品の`displayStatus`が`private`なら管理者のみアクセス可能
   - 管理者チェックは既存の`verifyAdmin`ミドルウェアまたは同様のロジックを使用

**メリット**:

- プライベート商品の画像を直接URLでアクセスできない
- アクセスログを取得可能
- 将来的にアクセス制限やレート制限を追加しやすい
- **ローカル・S3問わず、同じ認証チェック機構を使用可能**

**パフォーマンス考慮**:

- **ローカルストレージの場合**:
  - 画像ファイルの読み込みは`fs.readFile`または`stream`を使用
  - 適切な`Content-Type`ヘッダーを設定
  - ブラウザキャッシュの設定（`Cache-Control`ヘッダー）

- **S3ストレージの場合**:
  - S3から画像をダウンロードしてエンドポイント経由で配信
  - S3の`getObject()`を使用してストリームで取得（メモリ効率）
  - 適切な`Content-Type`ヘッダーを設定
  - ブラウザキャッシュの設定（`Cache-Control`ヘッダー）
  - S3バケットは**プライベート**に設定（直接アクセス不可）

**S3の設定**:

- S3バケットポリシーで、パブリックアクセスを**ブロック**
- IAMロールで、アプリケーションサーバーのみがS3にアクセス可能に設定
- CloudFrontは使用しない（認証チェックが必要なため）

## 8. パフォーマンス考慮事項

### 8.1 画像最適化（将来対応）

- 画像のリサイズ（サムネイル生成）
- WebP形式への変換
- 遅延読み込み（Lazy Loading）

### 8.2 キャッシュ

- ブラウザキャッシュの設定
- CDNの利用（S3移行時）

## 9. エラーハンドリング

### 9.1 バックエンド

**画像アップロードAPI**:

- ファイル形式エラー: 400 Bad Request
- ファイルサイズエラー: 400 Bad Request（将来の制限実装時）
- 最大枚数超過: 400 Bad Request
- 商品不存在: 404 Not Found
- 権限エラー: 403 Forbidden
- ストレージエラー: 500 Internal Server Error

**画像配信API**:

- 商品不存在: 404 Not Found
- 画像ファイル不存在: 404 Not Found
- プライベート商品への一般ユーザーアクセス: 403 Forbidden
- ファイル読み込みエラー: 500 Internal Server Error

### 9.2 フロントエンド

- アップロード進捗の表示
- エラーメッセージの表示
- 画像読み込み失敗時のフォールバック

## 10. テスト考慮事項

### 10.1 バックエンド

- 画像アップロードの成功ケース
- 不正なファイル形式の拒否
- 権限チェック
- ファイル削除とストレージの整合性

### 10.2 フロントエンド

- 画像表示のテスト
- アップロードUIの動作確認
- エラーハンドリングの確認

## 11. 実装順序

1. **Phase 1: バックエンド基盤**
   - `IImageStorageAdapter`インターフェースの定義
   - `LocalImageStorageAdapter`の実装（`uploads/items/`に保存）
   - `ItemImageRepository`の実装
   - 既存の`ItemRepository`に画像情報を含める
   - スキーマ変更（`onDelete: Cascade`）

2. **Phase 2: 画像配信API（認証チェック付き）**
   - `GetItemImageController`と`Interactor`の実装
   - 商品の`displayStatus`チェックロジック
   - 管理者権限チェックロジック
   - 画像ファイルの読み込みと配信
   - 適切な`Content-Type`と`Cache-Control`ヘッダーの設定

3. **Phase 3: 画像アップロードAPI**
   - `UploadItemImagesController`と`Interactor`の実装
   - ファイル検証ロジックの実装（拡張子、MIMEタイプ、最大枚数チェック）
   - orderの自動設定ロジック

4. **Phase 4: 画像管理API**
   - 削除・順序変更APIの実装
   - 画像削除時のストレージ連携

5. **Phase 5: フロントエンド（管理者）**
   - 画像アップロードUI（最大10枚制限の表示）
   - 画像一覧・削除・順序変更UI
   - 推奨サイズの表示

6. **Phase 6: フロントエンド（一般ユーザー）**
   - 商品一覧画面の画像表示（order=1の画像）
   - 商品詳細画面の画像カルーセル（order順）

7. **Phase 7: S3移行準備（将来）**
   - `S3ImageStorageAdapter`の実装
     - `save()`: S3へのアップロード（プライベートバケット）
     - `delete()`: S3からの削除
     - `getUrl()`: エンドポイント経由のURLを返す（ローカルと同じ）
     - `getFile()`: S3から画像を取得（エンドポイント経由配信用）
   - S3バケットの設定（プライベート、IAMロール設定）
   - 環境変数による切り替え機能のテスト
   - 既存画像のS3移行スクリプト作成
   - データベースの`src`フィールドは変更不要（エンドポイント経由のURLのため）

## 12. 不明点・考慮漏れ

### 12.1 決定事項

1. **画像の最大枚数制限**
   - ✅ **決定**: 1商品あたり最大10枚

2. **画像の削除時の動作**
   - ✅ **決定**: `onDelete: CASCADE`に変更（商品削除時に画像も自動削除）

3. **画像の順序**
   - ✅ **決定**: order=1が一番手前、以降インクリメント（1, 2, 3...）
   - ✅ **決定**: 商品一覧ではorder=1の画像を表示

4. **対応画像形式**
   - ✅ **決定**: jpg, jpeg, png, gif, webp, svg, **avif**

5. **ストレージ設計**
   - ✅ **決定**: アダプターパターンで実装し、ローカル→S3への移行を容易に

### 12.2 将来検討事項

1. **画像がない場合の表示**
   - プレースホルダー画像を表示するか？
   - デフォルト画像のパスを設定するか？

2. **画像のリサイズ**
   - アップロード時に自動リサイズするか？
   - サムネイルを生成するか？

3. **画像のメタデータ**
   - EXIF情報の削除（プライバシー対策）
   - 画像の向きの自動補正

### 12.3 実装の複雑さについて

**Q: URLへの直接アクセスでも商品の公開状態がprivateなら管理者以外アクセスできないようにする制御って大変ですか？**

**A: 実装は比較的簡単です。** 以下の実装で対応可能：

1. **画像を`public`ディレクトリの外に保存**
   - 静的ファイルとして公開されないため、直接アクセス不可

2. **専用のエンドポイントを作成**
   - `GET /images/items/:itemId/:filename`
   - 商品の`displayStatus`をチェック
   - `private`の場合は管理者権限をチェック

3. **実装の流れ**:

   ```
   リクエスト → 商品情報取得 → displayStatusチェック
   → privateなら管理者チェック → 画像ファイル読み込み → 配信
   ```

4. **パフォーマンス考慮**:
   - 商品情報はキャッシュ可能（Redis等、オプション）
   - 画像ファイルは`stream`で配信（メモリ効率）
   - `Cache-Control`ヘッダーでブラウザキャッシュを設定

5. **S3の場合も同じ機構**:
   - S3バケットは**プライベート**に設定（直接アクセス不可）
   - `getUrl()`はエンドポイント経由のURLを返す（ローカルと同じ）
   - エンドポイントで認証チェック後、`getFile()`でS3から画像を取得
   - ローカル・S3問わず、同じ認証チェック機構を使用

**実装コスト**: 中程度（1-2日程度）

- 既存の認証ミドルウェアを活用可能
- 商品情報取得ロジックは既存の`ItemRepository`を利用
- 新規に必要なのは画像配信のControllerとInteractorのみ
- S3の場合も`ImageStorageAdapter`の`getFile()`を実装するだけ（追加1日程度）

### 12.4 実装時の注意事項

1. **スキーマ変更（必須）**

   ```prisma
   model ItemImages {
     // ...
     item Items @relation(fields: [itemId], references: [id], onDelete: Cascade)
   }
   ```

2. **推奨サイズの表示**
   - 商品一覧用: 800x800px（正方形推奨）
   - 商品詳細用: 1200x1200px（正方形推奨）
   - UIに推奨サイズを表示（例: "推奨サイズ: 800x800px"）

3. **orderの扱い**
   - 新規アップロード時: `maxOrder + 1`を設定（最初は1）
   - 順序変更時: 他の画像のorderを調整（必要に応じて）
   - 削除時: 削除後の画像のorderを再調整（オプション、または削除時はそのまま）

4. **ストレージアダプターの実装**
   - `IImageStorageAdapter`インターフェースを厳密に定義
   - 環境変数で切り替え可能に
   - テスト時はモックアダプターを使用可能に

5. **プレースホルダー画像**
   - 画像がない場合はデフォルト画像を表示
   - `/public/images/no-image.png` など
