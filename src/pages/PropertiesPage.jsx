import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

// フォームの初期値
const initialForm = { name: '', rent: '', area: '', layout: '' }

export default function PropertiesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null) // nullなら新規登録モード
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  // 物件一覧をSupabaseから取得（SELECT）
  const fetchProperties = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // 新規登録モードでモーダルを開く
  const openCreateModal = () => {
    setEditingProperty(null)
    setForm(initialForm)
    setIsModalOpen(true)
  }

  // 編集モードでモーダルを開く（既存データをフォームにセット）
  const openEditModal = (property) => {
    setEditingProperty(property)
    setForm({
      name: property.name,
      rent: String(property.rent),
      area: property.area,
      layout: property.layout,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProperty(null)
    setForm(initialForm)
  }

  // フォーム送信: 新規登録（INSERT）または更新（UPDATE）
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      name: form.name,
      rent: parseInt(form.rent, 10),
      area: form.area,
      layout: form.layout,
    }

    let queryError

    if (editingProperty) {
      // 既存物件を更新（RLSにより自分の物件のみ更新可能）
      const { error } = await supabase
        .from('properties')
        .update(payload)
        .eq('id', editingProperty.id)
      queryError = error
    } else {
      // 新規物件を登録（user_idを付与してRLSポリシーを通過させる）
      const { error } = await supabase
        .from('properties')
        .insert({ ...payload, user_id: user.id })
      queryError = error
    }

    if (queryError) {
      setError((editingProperty ? '更新' : '登録') + 'に失敗しました: ' + queryError.message)
    } else {
      closeModal()
      fetchProperties()
    }
    setSubmitting(false)
  }

  // 物件を削除（DELETE）
  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除しますか？')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      setError('削除に失敗しました: ' + error.message)
    } else {
      // 削除成功後は一覧を再取得
      fetchProperties()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="properties-container">
      <header className="properties-header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button className="btn-logout" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <div className="properties-toolbar">
        <p className="properties-count">
          {loading ? '読み込み中...' : `${properties.length} 件`}
        </p>
        <button className="btn-add" onClick={openCreateModal}>
          ＋ 新規登録
        </button>
      </div>

      {error && <p className="page-error">{error}</p>}

      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">物件がまだ登録されていません</p>
          <button className="btn-primary" onClick={openCreateModal}>
            最初の物件を登録する
          </button>
        </div>
      ) : (
        <main className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-icon">🏠</div>
              <h3 className="property-name">{property.name}</h3>
              <p className="property-layout">🏗 {property.layout}</p>
              <p className="property-area">📍 {property.area}</p>
              <p className="property-rent">
                月額 <span className="rent-amount">{property.rent.toLocaleString()}</span> 円
              </p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => openEditModal(property)}>
                  編集
                </button>
                <button className="btn-delete" onClick={() => handleDelete(property.id)}>
                  削除
                </button>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* 新規登録・編集モーダル */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProperty ? '物件を編集' : '物件を新規登録'}
              </h2>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>物件名</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例：渋谷ハイツ 301号室"
                  required
                />
              </div>
              <div className="form-group">
                <label>家賃（円）</label>
                <input
                  type="number"
                  value={form.rent}
                  onChange={(e) => setForm({ ...form, rent: e.target.value })}
                  placeholder="例：80000"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>エリア名</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="例：東京都渋谷区"
                  required
                />
              </div>
              <div className="form-group">
                <label>間取り</label>
                <input
                  type="text"
                  value={form.layout}
                  onChange={(e) => setForm({ ...form, layout: e.target.value })}
                  placeholder="例：1LDK"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  キャンセル
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? '処理中...' : editingProperty ? '更新する' : '登録する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
