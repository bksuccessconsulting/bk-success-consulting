import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'
import { cabinetInfo } from '../data/content'

const repliesRapides = [
  { label: '💼 Demander un devis', msg: "Bonjour BK Success Consulting, je souhaite demander un devis pour vos services comptables." },
  { label: '🎓 S\'inscrire en formation', msg: "Bonjour, je voudrais m'inscrire à l'une de vos formations certifiantes." },
  { label: '🏢 Créer mon entreprise', msg: "Bonjour, j'ai besoin d'aide pour créer mon entreprise au Cameroun." },
  { label: '📊 Déclaration fiscale', msg: "Bonjour, j'ai besoin d'aide pour ma déclaration fiscale (TVA, DSF)." },
  { label: '📞 Prendre rendez-vous', msg: "Bonjour, je souhaite prendre rendez-vous avec votre cabinet." },
]

function IconWA({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

export default function WhatsAppButton() {
  const [ouvert, setOuvert] = useState(false)
  const [notif, setNotif] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setNotif(true), 5000)
    return () => clearTimeout(t)
  }, [])

  const sendMessage = (message) => {
    window.open(`https://wa.me/${cabinetInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
    setOuvert(false)
  }

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">

      {/* Widget panel */}
      <AnimatePresence>
        {ouvert && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl w-72 overflow-hidden border border-gray-100"
          >
            {/* Header vert */}
            <div className="bg-[#25D366] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <img src="/logo.png" alt="" className="w-7 h-7 object-contain filter brightness-0 invert" />
                </div>
                <div>
                  <p className="text-white font-black text-sm leading-tight">BK Success Consulting</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <p className="text-white/80 text-xs">En ligne · Répond rapidement</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOuvert(false)} className="text-white/70 hover:text-white transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            {/* Bulle de message */}
            <div className="p-4 bg-[#ECF5FD]">
              <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm max-w-[90%]">
                <p className="text-gray-700 text-sm leading-relaxed">
                  👋 Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?
                </p>
                <p className="text-gray-400 text-[10px] mt-1.5">BK Success Consulting · Cabinet comptable</p>
              </div>
            </div>

            {/* Réponses rapides */}
            <div className="p-3 bg-white space-y-1.5 border-t border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mb-2">Que souhaitez-vous ?</p>
              {repliesRapides.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(reply.msg)}
                  className="w-full flex items-center justify-between gap-2 bg-[#F4F6F8] hover:bg-[#E8F5E9] border border-gray-200 hover:border-[#25D366] rounded-xl px-3 py-2.5 text-left transition-all duration-150 group"
                >
                  <span className="text-xs text-gray-700 font-semibold group-hover:text-[#1a8a48]">{reply.label}</span>
                  <ChevronRight size={13} className="text-gray-400 group-hover:text-[#25D366] shrink-0" />
                </button>
              ))}
            </div>

            {/* Bouton principal */}
            <div className="px-3 py-3 bg-[#F4F6F8] border-t border-gray-100">
              <button
                onClick={() => sendMessage("Bonjour BK Success Consulting, j'ai une question.")}
                className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <IconWA size={18} color="white" />
                Ouvrir WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulle de notification */}
      <AnimatePresence>
        {notif && !ouvert && (
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => { setOuvert(true); setNotif(false) }}
            className="relative bg-white text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors max-w-[180px] text-center"
          >
            👋 Bonjour ! Besoin d'aide ?
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant */}
      <motion.button
        onClick={() => { setOuvert(!ouvert); setNotif(false) }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full flex items-center justify-center shadow-2xl transition-colors"
        aria-label="Contacter sur WhatsApp"
      >
        <AnimatePresence mode="wait">
          {ouvert ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={26} color="white" />
            </motion.div>
          ) : (
            <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <IconWA size={28} color="white" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </motion.button>
    </div>
  )
}