import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

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

      <main className="pt-[92px]">
        {children}
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />

        <Route
          path="/services"
          element={
            <PublicLayout>
              <Services />
            </PublicLayout>
          }
        />

        <Route
          path="/formations"
          element={
            <PublicLayout>
              <Formations />
            </PublicLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        <Route path="/admin" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Routes>
    </Router>
  )
}

export default App