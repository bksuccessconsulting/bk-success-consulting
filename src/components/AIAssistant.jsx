import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, Sparkles, User, Mic, Volume2, Globe } from 'lucide-react'
import { cabinetInfo } from '../data/content'

const SUGGESTIONS_INITIALES = [
  { emoji: '📊', label: 'TVA au Cameroun', question: 'Comment fonctionne la TVA au Cameroun ?' },
  { emoji: '🏢', label: 'Créer mon entreprise', question: 'Comment créer mon entreprise au Cameroun ?' },
  { emoji: '🎓', label: 'Vos formations', question: 'Quelles formations proposez-vous et quels sont les tarifs ?' },
  { emoji: '📋', label: 'La DSF', question: "C'est quoi la DSF et comment la remplir ?" },
  { emoji: '💼', label: 'Demander un devis', question: 'Je voudrais un devis pour vos services comptables.' },
  { emoji: '👥', label: 'CNPS et paie', question: 'Comment calculer les cotisations CNPS sur un salaire ?' },
]

// Affichage mot par mot (simulation streaming)
function useStreaming() {
  const [texteAffiche, setTexteAffiche] = useState('')
  const [enCours, setEnCours] = useState(false)
  const timerRef = useRef(null)

  const demarrer = useCallback((texteComplet, onFin) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTexteAffiche('')
    setEnCours(true)
    const mots = texteComplet.split(' ')
    let i = 0
    timerRef.current = setInterval(() => {
      if (i >= mots.length) {
        clearInterval(timerRef.current)
        setEnCours(false)
        onFin?.()
        return
      }
      setTexteAffiche(prev => prev + (i > 0 ? ' ' : '') + mots[i])
      i++
    }, 35)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  return { texteAffiche, enCours, demarrer }
}

export default function AIAssistant() {
  const [ouvert, setOuvert] = useState(false)
  const [historique, setHistorique] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [langue, setLangue] = useState('fr')
  const [messageEnStream, setMessageEnStream] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { texteAffiche, enCours: streaming, demarrer: demarrerStream } = useStreaming()

  useEffect(() => {
    const t = setTimeout(() => setNotif(true), 8000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [historique, texteAffiche])

  useEffect(() => {
    if (ouvert) { setNotif(false); setTimeout(() => inputRef.current?.focus(), 150) }
  }, [ouvert])

  const envoyerMessage = async (texte = input) => {
    const question = texte.trim()
    if (!question || loading || streaming) return

    setInput('')
    setErreur(null)

    const nouvelHistorique = [...historique, { role: 'user', content: question }]
    setHistorique(nouvelHistorique)
    setLoading(true)
    setMessageEnStream(null)

    try {
      const reponse = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nouvelHistorique.map(m => ({ role: m.role, content: m.content })),
          langue,
        }),
      })

      const donnees = await reponse.json()

      if (!reponse.ok || donnees.error) {
        throw new Error(donnees.error || 'Erreur serveur')
      }

      const texteReponse = donnees.reponse

      // Ajoute un message vide en attente du stream
      setMessageEnStream({ role: 'assistant', content: '' })
      setHistorique(prev => [...prev, { role: 'assistant', content: texteReponse }])
      setMessageEnStream(null)

      // Lance l'animation mot par mot
      demarrerStream(texteReponse, () => {
        setMessageEnStream(null)
      })

    } catch (err) {
      setErreur(err.message || 'Erreur de connexion. Réessayez ou contactez-nous sur WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); envoyerMessage() }
  }

  const formaterTexte = (texte) => {
    return texte
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  // Détermine si on est en train de streamer le dernier message
  const dernierMessageIndex = historique.length - 1
  const estDernierAssistant = (i) => i === dernierMessageIndex && historique[i]?.role === 'assistant'

  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3">

      {/* Panel chat */}
      <AnimatePresence>
        {ouvert && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-80 md:w-[360px] overflow-hidden border border-white/50 flex flex-col"
            style={{
              height: '530px',
              maxHeight: '78vh',
              boxShadow: '0 25px 60px rgba(6,82,128,0.2), 0 0 0 1px rgba(255,255,255,0.4)'
            }}
          >
            {/* Header glassmorphism */}
            <div className="relative bg-gradient-to-r from-[#065280] via-[#0A69AD] to-[#065280] p-4 flex items-center justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(201,162,39,0.15)_0%,_transparent_60%)]" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                  <Sparkles className="text-[#C9A227]" size={20} />
                </div>
                <div>
                  <p className="text-white font-black text-sm tracking-wide">Assistant BKSC</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full shadow-sm shadow-[#25D366]/50" />
                    <p className="text-white/60 text-[10px] font-semibold tracking-wide uppercase">IA · Fiscalité & Comptabilité</p>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-1.5">
                {/* Toggle langue */}
                <button
                  onClick={() => setLangue(l => l === 'fr' ? 'en' : 'fr')}
                  className="text-white/50 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-all text-[10px] font-bold border border-white/10"
                  title={langue === 'fr' ? 'Switch to English' : 'Passer en français'}
                >
                  <Globe size={13} />
                </button>
                <button
                  onClick={() => setOuvert(false)}
                  className="text-white/50 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Zone messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#F4F6F8]/80 to-white/80">

              {/* Message d'accueil */}
              {historique.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#065280] to-[#0A69AD] flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="text-[#C9A227]" size={15} />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[82%]">
                    <p className="text-gray-700 text-xs leading-relaxed">
                      {langue === 'fr'
                        ? <>👋 Bonjour ! Je suis l'assistant IA de <strong>BK Success Consulting</strong>.<br /><br />Je réponds à vos questions sur la <strong>fiscalité camerounaise</strong>, la <strong>comptabilité OHADA</strong>, la <strong>création d'entreprise</strong> et nos <strong>formations</strong>.</>
                        : <>👋 Hello! I'm BK Success Consulting's AI assistant.<br /><br />I can help with <strong>Cameroonian taxation</strong>, <strong>OHADA accounting</strong>, <strong>business creation</strong> and our <strong>training programs</strong>.</>
                      }
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Historique */}
              {historique.map((msg, i) => {
                const isLastAssistant = estDernierAssistant(i)
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                      msg.role === 'user' ? 'bg-[#0A69AD]' : 'bg-gradient-to-br from-[#065280] to-[#0A69AD]'
                    }`}>
                      {msg.role === 'user'
                        ? <User className="text-white" size={13} />
                        : <Sparkles className="text-[#C9A227]" size={13} />
                      }
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#0A69AD] text-white rounded-tr-sm shadow-md'
                        : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-sm'
                    }`}>
                      {msg.role === 'assistant' && isLastAssistant && !loading ? (
                        // Dernier message assistant → afficher avec streaming
                        <span dangerouslySetInnerHTML={{ __html: formaterTexte(texteAffiche || msg.content) }} />
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: formaterTexte(msg.content) }} />
                      )}
                      {msg.role === 'assistant' && isLastAssistant && streaming && (
                        <span className="inline-block w-0.5 h-3 bg-[#0A69AD] ml-0.5 animate-pulse rounded-full align-middle" />
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {/* Loading dots */}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#065280] to-[#0A69AD] flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="text-[#C9A227]" size={13} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5">
                      {[0, 150, 300].map((d) => (
                        <div key={d} className="w-1.5 h-1.5 bg-[#0A69AD]/60 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Message d'erreur */}
              {erreur && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <span className="text-red-500 text-xs font-black">!</span>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[80%]">
                    <p className="text-red-600 text-xs leading-relaxed">{erreur}</p>
                    <a href={`https://wa.me/${cabinetInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-[#25D366] hover:underline">
                      💬 Contacter sur WhatsApp →
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Suggestions initiales */}
              {historique.length === 0 && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-2 pt-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                    {langue === 'fr' ? 'Questions fréquentes' : 'Frequent questions'}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SUGGESTIONS_INITIALES.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                        onClick={() => envoyerMessage(s.question)}
                        className="group text-left bg-white hover:bg-[#065280] border border-gray-100 hover:border-[#065280] rounded-xl px-2.5 py-2 transition-all duration-150 shadow-sm hover:shadow-md"
                      >
                        <span className="text-base block mb-0.5">{s.emoji}</span>
                        <span className="text-[10px] font-bold text-gray-600 group-hover:text-white leading-tight block">{s.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="p-3 bg-white/90 backdrop-blur-sm border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-2 bg-[#F4F6F8] rounded-xl border border-gray-200 focus-within:border-[#0A69AD] focus-within:ring-2 focus-within:ring-[#0A69AD]/10 transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={langue === 'fr' ? 'Votre question fiscale ou comptable…' : 'Your accounting question…'}
                  disabled={loading || streaming}
                  className="flex-1 bg-transparent text-xs px-3 py-2.5 outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                />
                <button
                  onClick={() => envoyerMessage()}
                  disabled={!input.trim() || loading || streaming}
                  className="w-8 h-8 bg-[#0A69AD] hover:bg-[#065280] disabled:bg-gray-200 rounded-lg flex items-center justify-center mr-1 transition-colors shrink-0 shadow-sm"
                >
                  {loading
                    ? <Loader2 size={13} className="text-white animate-spin" />
                    : <Send size={13} className="text-white" />
                  }
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <p className="text-[9px] text-gray-400">Propulsé par Claude IA · Fiscalité Cameroun</p>
                <a href={`https://wa.me/${cabinetInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="text-[9px] text-[#25D366] font-bold hover:underline">
                  💬 Expert humain →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulle de notification */}
      <AnimatePresence>
        {notif && !ouvert && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            onClick={() => setOuvert(true)}
            className="relative bg-white/95 backdrop-blur-sm text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer max-w-[190px] text-center border border-gray-100"
            style={{ boxShadow: '0 8px 30px rgba(6,82,128,0.15)' }}
          >
            <Sparkles size={11} className="inline text-[#C9A227] mr-1" />
            Une question sur la TVA ou la DSF ?
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant */}
      <motion.button
        onClick={() => { setOuvert(!ouvert); setNotif(false) }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #065280 0%, #0A69AD 100%)',
          boxShadow: '0 8px 25px rgba(6,82,128,0.4)'
        }}
        aria-label="Assistant IA BKSC"
      >
        <AnimatePresence mode="wait">
          {ouvert ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} color="white" />
            </motion.div>
          ) : (
            <motion.div key="ai" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Sparkles size={20} color="#C9A227" />
            </motion.div>
          )}
        </AnimatePresence>
        {!ouvert && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A227] rounded-full text-[8px] text-[#065280] font-black flex items-center justify-center shadow-sm">
            IA
          </span>
        )}
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-xl bg-[#0A69AD] animate-ping opacity-15" />
      </motion.button>
    </div>
  )
}