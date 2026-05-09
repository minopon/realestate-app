# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git 運用ルール

**コードを変更するたびに、必ず GitHub にプッシュすること。**

```bash
git add <変更ファイル>
git commit -m "変更内容の簡潔な説明"
git push origin main
```

- コミットメッセージは変更の意図が伝わる日本語または英語で記述する
- `main` への直接プッシュは避け、機能ブランチを使う（大きな変更の場合）
- プッシュ前に `git status` で意図しない変更が含まれていないか確認する
- `.env` など機密情報を含むファイルは `.gitignore` に追加済みで、絶対にコミットしない

## プロジェクト概要

Supabase 認証機能付きの不動産管理 Web アプリ。React + Vite 構成。

- ログイン・新規登録（メール＋パスワード）
- ログイン後は物件一覧画面に遷移（現在はダミーデータ）
- 未認証時はログイン画面へリダイレクト

## 開発コマンド

npm コマンドは **WSL 内**で実行すること（WindowsのUNCパスでは動作しない）。

```bash
# WSL内で実行
wsl -d Ubuntu-22.04 -- bash -c "cd /root/work/realestate-app && npm run dev"
wsl -d Ubuntu-22.04 -- bash -c "cd /root/work/realestate-app && npm run build"
wsl -d Ubuntu-22.04 -- bash -c "cd /root/work/realestate-app && npm install"
```

開発サーバーは `http://localhost:5173` で起動する。

## アーキテクチャ

```
src/
├── App.jsx               # ルーティング定義（BrowserRouter + PrivateRoute）
├── supabaseClient.js     # Supabaseクライアントの初期化（環境変数から読み込み）
├── context/
│   └── AuthContext.jsx   # 認証状態のグローバル管理（useAuth フック）
├── pages/
│   ├── LoginPage.jsx     # ログイン画面
│   ├── RegisterPage.jsx  # 新規登録画面
│   └── PropertiesPage.jsx # 物件一覧（ダミーデータ）
├── components/
│   └── PrivateRoute.jsx  # 未認証ユーザーを /login へリダイレクト
└── index.css             # 全画面共通のスタイル
```

### 認証フロー

1. `AuthContext` が `supabase.auth.getSession()` で初期セッションを取得
2. `onAuthStateChange` でログイン・ログアウト時に `user` 状態を自動更新
3. `PrivateRoute` が `user === null` の場合に `/login` へリダイレクト

### 環境変数

`.env`（`.gitignore` 済み）で管理：

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Vite の慣例に従い `VITE_` プレフィックスが必要。
