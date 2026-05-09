import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

// ダミーの物件データ
const dummyProperties = [
  { id: 1, name: '渋谷ハイツ 301号室', rent: 120000, area: '東京都渋谷区道玄坂' },
  { id: 2, name: '新宿グランドマンション 504号室', rent: 95000, area: '東京都新宿区西新宿' },
  { id: 3, name: '池袋コートヴィラ 201号室', rent: 82000, area: '東京都豊島区東池袋' },
  { id: 4, name: '品川レジデンス 702号室', rent: 155000, area: '東京都品川区北品川' },
  { id: 5, name: '恵比寿ガーデンテラス 103号室', rent: 185000, area: '東京都渋谷区恵比寿' },
  { id: 6, name: '中野フラット 401号室', rent: 68000, area: '東京都中野区中野' },
]

export default function PropertiesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // ログアウト後はログイン画面へ遷移
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

      <main className="properties-grid">
        {dummyProperties.map((property) => (
          <div key={property.id} className="property-card">
            <div className="property-icon">🏠</div>
            <h3 className="property-name">{property.name}</h3>
            <p className="property-area">📍 {property.area}</p>
            <p className="property-rent">
              月額 <span className="rent-amount">{property.rent.toLocaleString()}</span> 円
            </p>
          </div>
        ))}
      </main>
    </div>
  )
}
