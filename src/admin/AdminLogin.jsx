import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  // ⚠️ Connexion Firebase réelle à brancher à l'étape suivante
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#065280] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <img src="/logo.png" alt="BK Success Consulting" className="h-14 mx-auto mb-6" />
        <h1 className="text-xl font-bold text-[#065280] text-center mb-6">Espace Administration</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-[#0A69AD]" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe"
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:border-[#0A69AD]" />
          </div>
          <button type="submit" className="w-full bg-[#0A69AD] hover:bg-[#065280] text-white font-bold py-3 rounded-lg transition-colors">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}