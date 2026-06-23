import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'

const CODE_ADMIN = 'BOUKEUFLORIAN@'

export default function AdminLogin() {
  const [code, setCode] = useState('')
  const [erreur, setErreur] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code === CODE_ADMIN) {
      sessionStorage.setItem('bksc_admin_auth', 'true')
      navigate('/admin/dashboard')
    } else {
      setErreur(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#065280] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <img src="/logo.png" alt="BK Success Consulting" className="h-14 mx-auto mb-6" />
        <h1 className="text-xl font-bold text-[#065280] text-center mb-2">Espace Administration</h1>
        <p className="text-xs text-gray-400 text-center mb-6">Accès réservé à la direction</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="password" required value={code}
              onChange={(e) => { setCode(e.target.value); setErreur(false) }}
              placeholder="Code d'accès"
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-[#0A69AD]"
            />
          </div>
          {erreur && <p className="text-red-500 text-xs">Code incorrect.</p>}
          <button type="submit" className="w-full bg-[#0A69AD] hover:bg-[#065280] text-white font-bold py-3 rounded-lg transition-colors">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}