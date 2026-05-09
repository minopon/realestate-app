import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PropertiesPage from './pages/PropertiesPage'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    // 認証プロバイダーでアプリ全体をラップ
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* 認証が必要なルート：未ログインは /login へリダイレクト */}
          <Route
            path="/properties"
            element={
              <PrivateRoute>
                <PropertiesPage />
              </PrivateRoute>
            }
          />
          {/* 未定義パスはログイン画面へ */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
