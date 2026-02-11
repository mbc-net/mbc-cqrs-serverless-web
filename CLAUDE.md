# CLAUDE.md

このファイルはClaude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

MBC CQRS Serverless Web は、MBC CQRS Serverless フレームワーク用の Web フロントエンドコンポーネントライブラリです。Lerna によるモノレポ構成で、以下のパッケージを含みます：

- `packages/master/` - マスターデータ管理用コンポーネント (`@mbc-cqrs-serverless/master-web`)
- `packages/survey/` - アンケート/フォーム用コンポーネント (`@mbc-cqrs-serverless/survey-web`)

## 開発・リリースフロー

### ブランチ戦略

- `develop`: 開発ブランチ（デフォルトブランチ）
- `main`: 本番リリース用安定ブランチ

### ブランチ運用ルール

**main ブランチ**: 直接コミット・プッシュ禁止

- `main` への変更は必ず PR 経由でマージする

**develop ブランチ**: 直接コミット・プッシュ禁止

- `develop` への変更は必ずフィーチャーブランチを作成し、PR 経由でマージする
- ブランチ名の例: `feature/xxx`, `fix/xxx`, `ci/xxx`

### リリースプロセス

1. フィーチャーブランチを `develop` にマージ（PR経由）
2. `develop` → `main` へマージ（PR経由）
3. `main` で `v*` タグを作成
4. GitHub Actions が自動で npm 公開 + GitHub Release 作成

### バージョニング

セマンティックバージョニング（SemVer）に従います：

- `v0.0.43` - 本番リリース
- `v0.0.43-beta.1` - ベータリリース
- `v0.0.43-alpha.1` - アルファリリース

## 開発コマンド

```bash
npm install          # 依存関係インストール
npm run build        # 全パッケージビルド (lerna run build)
npm test             # テスト実行 (jest)
npm run lint         # lint 実行 (lerna run lint = tsc --noEmit)
npm run dev          # ウォッチモード開発
```

## GitHub Actions

- **CI/CD**: `.github/workflows/ci-cd.yml`
  - PR時: ユニットテスト（Node.js 18/20/22/24）、lint、セキュリティスキャン
  - タグ時: npm公開 + GitHub Release 作成
