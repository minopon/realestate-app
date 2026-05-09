import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError('登録に失敗しました: ' + error.message)
    } else {
      // Supabaseのメール確認設定により、確認メールが送信される場合がある
      setMessage('確認メールを送信しました。メールボックスをご確認ください。')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">不動産管理アプリ</h1>
        <h2 className="auth-subtitle">新規登録</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>パスワード（6文字以上）</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              minLength={6}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
        <p className="auth-link">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
