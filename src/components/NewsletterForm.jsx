import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { store } from '../data/contentStore'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [nom, setNom] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const souscrire = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setMessage({ succes: false, texte: 'Entrez une adresse email valide.' })
      return
    }
    setLoading(true)
    const result = await store.addAbonne(email.trim().toLowerCase(), nom.trim())
    setLoading(false)
    setMessage({ succes: result.succes, texte: result.message })
    if (result.succes) { setEmail(''); setNom('') }
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <div className="bg-gradient-to-br from-[#065280] to-[#0A69AD] rounded-2xl p-6 md:p-8">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-12 h-12 bg-[#C9A227] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Mail className="text-[#065280]" size={22} />
        </div>
        <h3 className="text-white font-black text-xl mb-2">
          Restez informé(e)
        </h3>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          Abonnez-vous pour recevoir nos actualités fiscales, nouvelles formations et conseils comptables directement dans votre boîte mail.
        </p>

        <form onSubmit={souscrire} className="space-y-3">
          <input
            type="text"
            value={nom}
            onChange={e => setNom(e.target.value)}
            placeholder="Votre nom (optionnel)"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9A227] transition-colors"
          />
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Votre adresse email *"
              required
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C9A227] transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="bg-[#C9A227] hover:bg-[#b8932a] disabled:opacity-50 text-[#065280] font-black px-5 py-3 rounded-xl transition-colors flex items-center gap-2 shrink-0 text-sm shadow-lg"
            >
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : 'S\'abonner'
              }
            </button>
          </div>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 justify-center ${
                message.succes
                  ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                  : 'bg-red-500/20 border border-red-500/30 text-red-300'
              }`}
            >
              {message.succes && <CheckCircle2 size={16} />}
              {message.texte}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-white/30 text-xs mt-4">
          🔒 Vos données sont confidentielles. Désabonnement possible à tout moment.
        </p>
      </div>
    </div>
  )
}