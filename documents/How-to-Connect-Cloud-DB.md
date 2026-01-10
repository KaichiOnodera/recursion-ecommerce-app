## 手順

## 1. ローカルPCの準備

### 1-1. AWS CLIのインストール

```bash
brew install awscli

# 確認
aws --version
```

### 1-2. AWS CLIの設定

```bash
aws configure
```

入力内容：

| 項目 | 入力 |
| --- | --- |
| AWS Access Key ID | あなたのアクセスキー |
| AWS Secret Access Key | あなたのシークレットキー |
| Default region | `ap-northeast-1` |
| Default output format | `json` |

> アクセスキーがない場合：
> IAM → ユーザー → 自分 → セキュリティ認証情報 → アクセスキーを作成

## 2. 環境ごとのリソース名

| 環境 | 踏み台EC2 | RDS |
| --- | --- | --- |
| STG | `bastion-for-rds-stg` | `ecommerce-stg-db` |
| 本番 | `bastion-for-rds-prd` | `ecommerce-prd-db` |

## 3. SSH接続

```bash
aws ec2-instance-connect ssh \
  --instance-id <EC2_INSTANCE_ID> \
  --connection-type eice \
  --local-forwarding 3306:<RDS_ENDPOINT>:3306
```

| 変数 | 値の取得方法 |
| --- | --- |
| `<EC2_INSTANCE_ID>` | AWSコンソール → EC2 → インスタンス → 対象環境の踏み台EC2のインスタンスID |
| `<RDS_ENDPOINT>` | AWSコンソール → RDS → データベース → 対象DB → 接続とセキュリティ → エンドポイント |

## 4. DBクライアントで接続

| 項目 | 値 |
| --- | --- |
| Host | `localhost` もしくは `127.0.0.1` |
| Port | `3306` |
| User | 下記「認証情報の確認方法」を参照 |
| Password | 下記「認証情報の確認方法」を参照 |

### 認証情報の確認方法

| 項目 | 確認方法 |
| --- | --- |
| User | AWSコンソール → RDS → データベース → 対象DB → 設定 → マスターユーザー名 |
| Password | AWSコンソール → ECS → タスク定義 → 対象のタスク定義 → 環境変数 → `DATABASE_URL` 内の値を確認 |

> `DATABASE_URL` の形式: `mysql://ユーザー名:パスワード@ホスト:ポート/データベース名`
>
> 例: `mysql://admin:MyPassword123@xxx.rds.amazonaws.com:3306/ecommerce`
> この場合、Userはadmin、Passwordは `MyPassword123`
