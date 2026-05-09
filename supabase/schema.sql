-- =============================================
-- 不動産管理アプリ: propertiesテーブル定義
-- Supabase SQL Editorで実行してください
-- =============================================

-- propertiesテーブルを作成
CREATE TABLE IF NOT EXISTS public.properties (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  rent       INTEGER     NOT NULL CHECK (rent >= 0),
  area       TEXT        NOT NULL,
  layout     TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLSを有効にする（デフォルトは全アクセス拒否）
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- ポリシー: 自分が登録した物件のみ参照可能（SELECT）
CREATE POLICY "自分の物件のみ参照可能"
  ON public.properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- ポリシー: 自分のuser_idでのみ登録可能（INSERT）
CREATE POLICY "自分の物件のみ登録可能"
  ON public.properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ポリシー: 自分が登録した物件のみ更新可能（UPDATE）
CREATE POLICY "自分の物件のみ更新可能"
  ON public.properties
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ポリシー: 自分が登録した物件のみ削除可能（DELETE）
CREATE POLICY "自分の物件のみ削除可能"
  ON public.properties
  FOR DELETE
  USING (auth.uid() = user_id);
