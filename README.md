# Medical Arch コールシステム

医療施設向けのオンコール（当直）管理システムです。スタッフのシフト管理、通話転送、レポート管理などの機能を提供します。

## システム構成

### バックエンド
- **技術スタック**: Node.js + Express.js + TypeScript
- **データベース**: MongoDB Atlas
- **キャッシュ**: Redis
- **外部サービス**: Twilio (音声通話), SendGrid (メール), Firebase (通知)

### フロントエンド
- **技術スタック**: React 18.2.0 + Ant Design 5.5.1
- **施設管理**: `on-call-system-facility-master`
- **スタッフ用**: `on-call-system-front-master`

## プロジェクト構造

```
medicalarch/                    # ← Gitリポジトリルート
├── .gitignore                  # archive/, *.csv, doc/research/ など除外指定
├── README.md                   # プロジェクト全体の説明（このファイル）
├── LICENSE                     # ライセンス情報
├── src/                        # ソースコード一式（Git管理対象）
│   ├── medical-arch-call-system-backend-master/  # バックエンドAPI
│   ├── on-call-system-facility-master/           # 施設管理フロントエンド
│   ├── on-call-system-front-master/              # スタッフ用フロントエンド
│   └── medicalarch.code-workspace                # VS Codeワークスペース
├── doc/                        # ドキュメント（Git管理対象）
│   ├── 仕様書.md               # システム仕様書
│   ├── system_survey.md        # システム調査結果
│   ├── detailed_survey.md      # 詳細調査結果
│   └── action_plan.md          # 対応計画
└── archive/                    # アーカイブファイル（Git管理外）
    └── *.zip                   # 既に展開済みのため不要
```

### Git管理の対象外

以下のディレクトリ・ファイルは`.gitignore`で除外されています：

- ❌ `archive/` - zipファイル（既に展開済みのため不要）
- ❌ `doc/research/` - ログファイル、個人情報などが含まれる可能性があるため
- ❌ `*.csv` - 調査結果CSVファイル（機密データが含まれる可能性があるため）
- ❌ `src/**/config/production.json` - 機密情報を含む設定ファイル
- ❌ `src/**/src/utils/firebaseToken.json` - Firebase認証情報

## Gitリポジトリの初期化

```bash
# リポジトリを初期化
git init

# 設定ファイルのテンプレートをコピー
cp src/medical-arch-call-system-backend-master/config/production.json.example \
   src/medical-arch-call-system-backend-master/config/production.json

# 初回コミット
git add .
git commit -m "Initial commit"

# リモートリポジトリを追加
git remote add origin <your-repository-url>
git push -u origin main
```

## セットアップ

### 前提条件
- Node.js 16.x 以上
- npm または yarn
- MongoDB Atlas アカウント
- Redis サーバー（ローカルまたはリモート）
- Twilio アカウント
- SendGrid アカウント
- Firebase プロジェクト

### バックエンドのセットアップ

```bash
cd src/medical-arch-call-system-backend-master
npm install

# 設定ファイルの作成
cp config/production.json.example config/production.json
# 環境変数を設定ファイルに記入

# 開発環境で起動
npm start
```

### フロントエンドのセットアップ

```bash
# 施設管理フロントエンド
cd src/on-call-system-facility-master
npm install
npm run build

# スタッフ用フロントエンド
cd src/on-call-system-front-master
npm install
npm run build
```

## 環境変数・設定

### バックエンド設定（config/production.json）

以下の設定が必要です：

- **データベース**: MongoDB Atlas 接続文字列
- **Redis**: ホスト、ポート
- **Twilio**: Account SID, Auth Token, API Key
- **SendGrid**: API Key
- **Firebase**: サービスアカウント認証情報
- **JWT**: アクセストークン、リフレッシュトークンの秘密鍵

**重要**: 機密情報は環境変数で管理することを推奨します。

## デプロイ

### 本番環境

```bash
# PM2でのプロセス管理
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### サーバー構成

- **Webサーバー**: Nginx (リバースプロキシ)
- **バックエンドAPI**: ポート 8001
- **フロントエンド**: ポート 3001, 3002

## 監視

### ヘルスチェック

```
GET /api/admin/checkCallForward
```

レスポンス: `{"success":true}`

### 推奨監視設定

- **URL**: `http://medical-arch.com/api/admin/checkCallForward`
- **間隔**: 5分
- **タイムアウト**: 30秒
- **期待するレスポンス**: `{"success":true}`

## トラブルシューティング

### よくある問題

#### 1. ログインできない、データが取得できない

**原因**: バックエンドAPIの停止

**確認方法**:
```bash
curl http://localhost:8001/api/admin/checkCallForward
```

**対処方法**:
```bash
pm2 restart npm-start-api
```

#### 2. データベース接続エラー

**確認方法**:
- MongoDB Atlas の接続設定確認
- ネットワークアクセス設定確認

**対処方法**:
- 接続文字列の確認
- IPアドレスの許可設定確認

## 開発ガイドライン

### コーディング規約

- TypeScriptを使用
- ESLint の設定に従う
- エラーハンドリングを適切に実装

### コミット規約

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `refactor`: リファクタリング
- `test`: テスト

## ライセンス

ISC License

## 保守・サポート

### 保守範囲

- 外部サービス（Twilio等）の仕様変更対応
- 軽微なバグ修正
- 緊急トラブル対応

### 問い合わせ

システムに関する問い合わせは、保守担当者までご連絡ください。
