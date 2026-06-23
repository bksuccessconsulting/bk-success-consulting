import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Formations from './pages/Formations'
import Contact from './pages/Contact'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-[92px]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

function ProtectedRoute({ children }) {
  const [autorise, setAutorise] = useState(null)

  useEffect(() => {
    const auth = sessionStorage.getItem('bksc_admin_auth')
    const timestamp = sessionStorage.getItem('bksc_admin_time')
    const DUREE = 4 * 60 * 60 * 1000

    if (auth && timestamp && Date.now() - parseInt(timestamp) < DUREE) {
      setAutorise(true)
    } else {
      sessionStorage.removeItem('bksc_admin_auth')
      sessionStorage.removeItem('bksc_admin_time')
      setAutorise(false)
    }
  }, [])

  if (autorise === null) return (
    <div className="min-h-screen bg-[#065280] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return autorise ? children : <Navigate to="/admin" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/formations" element={<PublicLayout><Formations /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App