# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git 運用ルール

**コードを変更するたびに、必ず GitHub にプッシュすること。**

具体的な手順：

```bash
git add <変更ファイル>
git commit -m "変更内容の簡潔な説明"
git push origin <ブランチ名>
```

- コミットメッセージは変更の意図が伝わる日本語または英語で記述する
- `main` / `master` への直接プッシュは避け、機能ブランチを使う
- プッシュ前に `git status` で意図しない変更が含まれていないか確認する
- `.env` など機密情報を含むファイルは `.gitignore` に必ず追加し、絶対にコミットしない

## プロジェクト概要

不動産アプリ（realestate-app）。プロジェクトが成長したら、以下の項目を随時更新すること。

## 開発コマンド

プロジェクトのセットアップ後、使用するフレームワーク・ツールに応じてここに追記する。

例（Next.js の場合）：
```bash
npm install        # 依存関係インストール
npm run dev        # 開発サーバー起動
npm run build      # プロダクションビルド
npm run lint       # Lint 実行
npm test           # テスト実行
```

## アーキテクチャ

プロジェクトの構成が決まったらここに記載する。
