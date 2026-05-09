import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      // ログイン成功後は物件一覧へ遷移
      navigate('/properties')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">不動産管理アプリ</h1>
        <h2 className="auth-subtitle">ログイン</h2>
        <form onSubmit={handleLogin}>
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
            <label>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
        <p className="auth-link">
          アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
        </p>
      </div>
    </div>
  )
}
