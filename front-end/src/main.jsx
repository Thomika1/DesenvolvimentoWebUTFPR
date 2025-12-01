import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from './ThemeContext'
import Home from './pages/Home'
import Contato from './pages/Contato'
import ChatPage from './pages/ChatPage'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { useState } from 'react'
import { useTheme } from './ThemeContext'
import { setToken } from './api'

function Root() {
  const [user, setUser] = useState(null)
  const { theme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  
  const bgClass = theme === 'dark'
    ? 'bg-[#1E1F20] text-[#E3E3E3]'
    : 'bg-white text-black'

  const handleLogout = () => {
    setUser(null)
    setToken(null)  // Limpar token do localStorage
    navigate('/')   // Redirecionar para home
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  // Não mostrar footer na página de chat
  const showFooter = location.pathname !== '/chat'

  return (
    <div className={`flex flex-col min-h-screen ${bgClass}`}>
      <Navbar user={user} onLogout={handleLogout} onLogin={handleLogin} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
          <Route path="/contato" element={<Contato />} />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
