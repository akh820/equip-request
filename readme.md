# 🏢 社内備品管理システム (Internal Equipment Management System)

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.12-brightgreen?logo=spring-boot)
![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

### [🌐 社内備品管理システムにアクセス](https://d2j1vq9s2zdy53.cloudfront.net/)

**🏗️ AWS アーキテクチャ**: S3 + CloudFront + EC2
社内備品の効率的な管理と申請のためのフルスタック Web アプリケーション

[主要機能](#-主要機能) • [技術スタック](#️-技術スタック) • [始め方](#-始め方) • [API ドキュメント](#-apiドキュメント)

</div>

---

## 📋 目次

- [主要機能](#-主要機能)
- [技術スタック](#️-技術スタック)
- [プロジェクト構造](#-プロジェクト構造)
- [始め方](#-始め方)
  - [前提条件](#前提条件)
  - [インストール](#インストール)
  - [環境変数設定](#環境変数設定)
  - [実行](#実行)
- [API ドキュメント](#-apiドキュメント)
- [主要画面](#️-主要画面)
- [デプロイ](#-デプロイ)
- [ライセンス](#-ライセンス)

---

## ✨ 主要機能

### 👤 ユーザー機能

- **会員登録/ログイン**: JWT ベースの認証システム
- **備品閲覧**: カテゴリー別備品一覧および詳細情報確認
- **備品申請**: カート機能による複数備品の一括申請
- **申請履歴管理**: 申請状態（処理待ち/承認/却下）の確認と追跡
- **多言語対応**: 韓国語/日本語の自動検出と切り替え

### 🔧 管理者機能

- **備品管理**: 備品の登録、編集、削除および在庫管理
- **画像アップロード**: AWS S3 による備品画像管理
- **申請管理**: 備品申請の承認/却下および理由の記録
- **リアルタイム統計**: 処理待ち/承認/却下件数のダッシュボード

### 🌐 共通機能

- **レスポンシブデザイン**: モバイル、タブレット、デスクトップ最適化
- **リアルタイム在庫確認**: 在庫不足/品切れの視覚的表示
- **仮想化リスト**: 大量データの最適化レンダリング
- **自動トークン更新**: Refresh Token によるセッション維持

---

## 🛠️ 技術スタック

### Backend

| 技術            | バージョン | 用途                       |
| --------------- | ---------- | -------------------------- |
| Spring Boot     | 3.4.12     | バックエンドフレームワーク |
| Java            | 17         | プログラミング言語         |
| Spring Security | -          | 認証/認可                  |
| JWT             | 0.12.3     | トークンベース認証         |
| Spring Data JPA | -          | ORM                        |
| MariaDB/MySQL   | -          | データベース               |
| AWS S3          | 2.20.26    | ファイルストレージ         |
| Swagger         | 2.2.0      | API ドキュメント化         |

### Frontend

| 技術           | バージョン | 用途               |
| -------------- | ---------- | ------------------ |
| React          | 19.2.0     | UI ライブラリ      |
| TypeScript     | 5.9.3      | 型安全性           |
| Vite           | 7.2.4      | ビルドツール       |
| TailwindCSS    | 4.1.17     | スタイリング       |
| React Router   | 7.9.6      | ルーティング       |
| Zustand        | 5.0.9      | グローバル状態管理 |
| TanStack Query | 5.90.12    | サーバー状態管理   |
| Axios          | 1.13.2     | HTTP クライアント  |
| i18next        | 25.7.1     | 多言語対応         |
| React Virtuoso | 4.17.0     | 仮想化リスト       |

---

## 📁 プロジェクト構造

```
equip-request/
├── backend/                    # Spring Boot バックエンド
│   ├── src/main/java/backend/
│   │   ├── config/            # 設定ファイル (Security, CORS, S3)
│   │   ├── controller/        # REST APIコントローラー
│   │   ├── domain/            # JPAエンティティ
│   │   ├── repository/        # JPAリポジトリ
│   │   ├── service/           # ビジネスロジック
│   │   └── util/              # ユーティリティ (JWT, S3)
│   └── src/main/resources/
│       ├── application.yml    # メイン設定
│       └── application-*.yml  # プロファイル別設定
│
├── frontend/                   # React フロントエンド
│   ├── src/
│   │   ├── common/            # 共通コンポーネント (Loading, etc)
│   │   ├── components/        # UIコンポーネント (shadcn/ui)
│   │   ├── pages/             # ページコンポーネント
│   │   │   ├── auth/          # ログイン/会員登録
│   │   │   ├── equipment/     # 備品一覧/詳細
│   │   │   ├── cart/          # カート
│   │   │   ├── request/       # 申請履歴
│   │   │   └── admin/         # 管理者ページ
│   │   ├── stores/            # Zustand ストア
│   │   ├── lib/               # ライブラリ (API, i18n)
│   │   ├── locales/           # 多言語翻訳ファイル
│   │   └── types/             # TypeScript型定義
│   └── public/                # 静的ファイル
│
└── README.md                   # プロジェクトドキュメント
```

---

## 🚀 始め方

### 前提条件

以下のソフトウェアがインストールされている必要があります：

- **Java 17** 以上
- **Node.js 18** 以上
- **npm** または **yarn**
- **MariaDB** または **MySQL** 8.0 以上
- **AWS アカウント** (S3 使用時)

### インストール

#### 1. リポジトリのクローン

```bash
git clone https://github.com/akh820/equip-request.git
cd equip-request
```

#### 2. バックエンド設定

```bash
cd backend

# Gradle依存関係のダウンロード
./gradlew build
```

#### 3. フロントエンド設定

```bash
cd frontend

# 依存関係のインストール
npm install
# または
yarn install
```

### 環境変数設定

#### Backend (`backend/.env`)

```env
# Database
DB_URL=jdbc:mysql://localhost:3306/equipment_request_db?useSSL=false&serverTimezone=Asia/Tokyo
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-256-bits
JWT_ACCESS_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=604800000

# AWS S3
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET=your-bucket-name

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080
```

### データベース初期化

```sql
CREATE DATABASE equipment_request_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

アプリケーション実行時に JPA が自動的にテーブルを作成します。

### 実行

#### バックエンド実行

```bash
cd backend
./gradlew bootRun
```

サーバーが `http://localhost:8080` で起動します。

#### フロントエンド実行（開発モード）

```bash
cd frontend
npm run dev
# または
yarn dev
```

フロントエンドが `http://localhost:5173` で起動します。

#### フロントエンドビルドおよびプロダクション実行

```bash
cd frontend

# ビルド
npm run build

# プロダクションサーバー実行
npm run start
```

---

## 📚 API ドキュメント

### Swagger UI

バックエンド実行後、以下の URL で API ドキュメントを確認できます：

```
http://localhost:8080/swagger-ui/index.html
```

### 主要エンドポイント

#### 認証 (`/auth`)

- `POST /auth/signup` - 会員登録
- `POST /auth/login` - ログイン
- `POST /auth/refresh` - トークン更新

#### 備品 (`/equipment`)

- `GET /equipment` - 備品一覧取得
- `GET /equipment/{id}` - 備品詳細取得
- `POST /equipment` - 備品登録（管理者）
- `PUT /equipment/{id}` - 備品編集（管理者）
- `DELETE /equipment/{id}` - 備品削除（管理者）

#### 申請 (`/requests`)

- `GET /requests/my` - マイ申請一覧
- `POST /requests` - 備品申請
- `GET /requests/admin/all` - 全申請一覧（管理者）
- `POST /requests/admin/{id}/approve` - 申請承認（管理者）
- `POST /requests/admin/{id}/reject` - 申請却下（管理者）

---

## 🖼️ 主要画面

### ユーザー画面

- **ログイン/会員登録**: JWT ベース認証
- **備品一覧**: カテゴリー別フィルタリングおよび検索
- **備品詳細**: 在庫確認およびカートに追加
- **カート**: 複数備品選択および申請
- **申請履歴**: 状態別フィルタリングおよび追跡

### 管理者画面

- **備品管理**: CRUD および画像アップロード
- **申請管理**: 承認/却下処理および統計ダッシュボード

---

## 🔐 認証フロー

```
1. ユーザーログイン
   ↓
2. サーバーがAccess Token + Refresh Tokenを発行
   ↓
3. Access Tokenをヘッダーに含めてAPIリクエスト
   ↓
4. Access Token期限切れ時
   ↓
5. Refresh Tokenで新しいAccess Tokenを発行
   ↓
6. リトライ
```

---

## 📦 デプロイ

### 現在のアーキテクチャ (AWS)

```
GitHub Push
     │
     ├─── frontend/** 変更 ──► GitHub Actions ──► S3 sync ──► CloudFront
     │
     └─── backend/** 変更 ──► GitHub Actions ──► EC2 SSH ──► docker-compose
```

| サービス | 技術 |
|----------|------|
| Frontend | S3 + CloudFront (CDN) |
| Backend | EC2 + Docker + Nginx |
| Database | MySQL (Docker) |
| Storage | S3 (画像) |
| SSL | Let's Encrypt |

---

## 🐛 トラブルシューティング

### よくある問題

#### CORS エラー

```bash
# backend/.env ファイルでCORS_ALLOWED_ORIGINSを確認
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### JWT トークン期限切れ

- Access Token が期限切れになると自動的に Refresh Token を使用して更新
- 問題が続く場合はログアウト後に再ログイン

#### S3 アップロード失敗

- AWS 認証情報を確認
- S3 バケット権限を確認（public-read 設定が必要）

#### カートデータの問題

- ログアウト時にカートは自動的に初期化されます
- 現在カートデータは localStorage にのみ保存されます（DB 保存なし）

---

## 🏗️ アーキテクチャ

```
┌────────────────────────────────────────────────────────────┐
│                        AWS Cloud                           │
│                                                            │
│   ┌─────────────────────┐        ┌─────────────────────┐   │
│   │  S3 (React Static)  │───────▶│  CloudFront (CDN)   │   │
│   └─────────────────────┘        └─────────────────────┘   │
│                                                            │
│   ┌────────────────────────────────────────────────────┐   │
│   │  EC2 (t3.micro)                                    │   │
│   │  ┌──────────────────────────────────────────────┐  │   │
│   │  │  Nginx (SSL)                                 │  │   │
│   │  └──────────────────────────────────────────────┘  │   │
│   │  ┌─── Docker ───────────────────────────────────┐  │   │
│   │  │  Spring Boot  ──────▶  MySQL                 │  │   │
│   │  └──────────────────────────────────────────────┘  │   │
│   └────────────────────────────────────────────────────┘   │
│                                                            │
│   ┌─────────────────────┐                                  │
│   │    S3 (Images)      │                                  │
│   └─────────────────────┘                                  │
└────────────────────────────────────────────────────────────┘
```

### 状態管理

- **Zustand**: グローバル状態（認証、カート）
- **TanStack Query**: サーバー状態（備品、申請）
- **localStorage**: 永続保存（認証トークン、カート）

---

## 🎨 デザインシステム

- **shadcn/ui**: 再利用可能な UI コンポーネント
- **TailwindCSS 4**: ユーティリティファーストスタイリング
- **Radix UI**: アクセシビリティの高いプリミティブコンポーネント
- **Lucide React**: 一貫したアイコンシステム

---

## 📝 ライセンス

このプロジェクトは MIT ライセンスの下にあります。
