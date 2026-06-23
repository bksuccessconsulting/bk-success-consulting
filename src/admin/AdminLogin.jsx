import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { setAdminSession } from './AdminGuard'

const CODE_ADMIN = 'BOUKEUFLORIAN@'
const MAX_TENTATIVES = 5
const BLOCAGE_DUREE = 5 * 60 * 1000 // 5 minutes

export default function AdminLogin() {
  const [code, setCode] = useState('')
  const [erreur, setErreur] = useState('')
  const [visible, setVisible] = useState(false)
  const [tentatives, setTentatives] = useState(0)
  const [bloque, setBloque] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (bloque) return

    if (code === CODE_ADMIN) {
      setAdminSession()
      navigate('/admin/dashboard', { replace: true })
    } else {
      const nouvelleTentative = tentatives + 1
      setTentatives(nouvelleTentative)

      if (nouvelleTentative >= MAX_TENTATIVES) {
        setBloque(true)
        setErreur(`Trop de tentatives. Réessayez dans 5 minutes.`)
        setTimeout(() => {
          setBloque(false)
          setTentatives(0)
          setErreur('')
        }, BLOCAGE_DUREE)
      } else {
        setErreur(`Code incorrect. ${MAX_TENTATIVES - nouvelleTentative} tentative(s) restante(s).`)
      }
      setCode('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#065280] to-[#0A69AD] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <img src="/logo.png" alt="BK Success Consulting" className="h-14 mx-auto mb-6" />
        <h1 className="text-xl font-bold text-[#065280] text-center mb-1">Espace Administration</h1>
        <p className="text-xs text-gray-400 text-center mb-6">Accès réservé à la direction</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type={visible ? 'text' : 'password'}
              required
              value={code}
              onChange={(e) => { setCode(e.target.value); setErreur('') }}
              placeholder="Code d'accès"
              disabled={bloque}
              className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-3 text-sm outline-none focus:border-[#0A69AD] disabled:bg-gray-50"
            />
            <button type="button" onClick={() => setVisible(!visible)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">
              {erreur}
            </div>
          )}

          <button
            type="submit"
            disabled={bloque}
            className="w-full bg-[#0A69AD] hover:bg-[#065280] disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {bloque ? 'Accès temporairement bloqué' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 mt-6">
          BK Success Consulting © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}