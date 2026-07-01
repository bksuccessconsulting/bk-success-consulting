import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, Sparkles, User, Globe, ChevronRight, MessageCircle } from 'lucide-react'
import { cabinetInfo } from '../data/content'

// ✅ Même URL que ton code qui marche
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const SYSTEM_PROMPT = `Tu es l'assistant IA officiel de BK SUCCESS CONSULTING SARL, cabinet comptable et de conseil basé à Douala, Cameroun.

INFORMATIONS CABINET :
- Nom : BK SUCCESS CONSULTING SARL
- Adresse : Ndogbong ancien dépot guinness
- Téléphone : +237 657 37 89 27 / +237 673 40 92 31
- WhatsApp : +237 657 37 89 27
- Email : bksuccessconsulting@gmail.com
- RCCM : RC/DLN/2019/B/1069 | NIU : M051912785954F
- Fondé en 2019 | SARL Droit OHADA
- Horaires : Lun-Ven 08h-17h | Sam 08h-13h

SERVICES :
1. Comptabilité SYSCOHADA révisé (états financiers, bilan, rapprochement)
2. Fiscalité & Déclarations (TVA 19,25%, IS, DSF, patentes, DGI)
3. Social & Paie (CNPS, bulletins salaire, DIPE, IRPP)
4. Juridique & Structuration (création entreprise CFCE, statuts OHADA)
5. Audit & Contrôle de gestion (tableaux de bord, KPIs, analyse financière)
6. Conseil en gestion (budget, optimisation fiscale, business plan)

FORMATIONS CERTIFIANTES (3 mois / 240h | Attestation BKSC avec mention) :
- Module 1 : Comptabilité Pratique OHADA → dès 110 000 FCFA
- Module 2 : Fiscalité PME & DSF Pratique → dès 110 000 FCFA
- Module 3 : Création Entreprise/CNPS/Paie → dès 110 000 FCFA
- Module 4 : Audit Interne & Outils Numériques → dès 110 000 FCFA
Tarifs : Étudiants 110 000 | Salariés 150 000 | Chefs entreprise 200 000 FCFA

FISCALITÉ CAMEROUN :
- TVA : 19,25% — déclaration mensuelle portail DGI
- IS : acomptes mensuels, taux standard 33%
- DSF : Déclaration Statistique et Fiscale annuelle (CF1, CF2, annexes)
- CNPS : cotisation employeur 16,2% + salarié 4,2% du salaire brut
- IRPP : retenu à la source sur salaires
- Patente : impôt professionnel annuel
- SARL : capital minimum 1 000 000 FCFA, dossier CFCE

RÈGLES :
- Réponds TOUJOURS en français (sauf si l'utilisateur écrit en anglais)
- Professionnel, précis, rassurant — maximum 150 mots
- developpeur web YONTA IVAROL (irolivarol@gmail.com)
- Pour devis ou RDV → inviter WhatsApp +237 657 37 89 27`

const SUGGESTIONS = [
  { emoji: '📊', label: 'TVA au Cameroun', question: 'Comment fonctionne la TVA au Cameroun ?' },
  { emoji: '🏢', label: 'Créer entreprise', question: 'Comment créer mon entreprise au Cameroun ?' },
  { emoji: '🎓', label: 'Vos formations', question: 'Quelles formations proposez-vous et quels sont les tarifs ?' },
  { emoji: '📋', label: "C'est quoi la DSF ?", question: "C'est quoi la DSF et comment la remplir ?" },
  { emoji: '💼', label: 'Demander un devis', question: 'Je voudrais un devis pour vos services comptables.' },
  { emoji: '👥', label: 'Calcul CNPS', question: 'Comment calculer les cotisations CNPS sur un salaire ?' },
]

// Animation mot par mot
function useTypingEffect() {
  const [displayed, setDisplayed] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const timerRef = useRef(null)

  const startTyping = useCallback((text, onDone) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setDisplayed('')
    setIsTyping(true)
    let i = 0
    function type() {
      if (i >= text.length) {
        setIsTyping(false)
        onDone?.()
        return
      }
      setDisplayed(text.slice(0, i + 1))
      i++
      timerRef.current = setTimeout(type, 10)
    }
    type()
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])
  return { displayed, isTyping, startTyping }
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [langue, setLangue] = useState('fr')
  const [streamTarget, setStreamTarget] = useState(null)
  const [notif, setNotif] = useState(false)

  const endRef = useRef(null)
  const inputRef = useRef(null)
  const { displayed, isTyping, startTyping } = useTypingEffect()

  useEffect(() => {
    const t = setTimeout(() => setNotif(true), 9000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, displayed])

  useEffect(() => {
    if (open) {
      setNotif(false)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  // ✅ Exactement ta logique qui fonctionne en local
  const send = async (text = input) => {
    const q = text.trim()
    if (!q || loading || isTyping) return

    setInput('')
    setError(null)

    const newMessages = [...messages, { role: 'user', content: q }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

      if (!apiKey) {
        throw new Error('Clé OpenRouter manquante.')
      }

      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://bk-success-consulting.netlify.app',
          'X-Title': 'BK Success Consulting',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT + (langue === 'en' ? '\n\nRespond in English.' : '')
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          max_tokens: 400,
        })
      })

      // ✅ Lecture sécurisée — évite le crash si réponse non-JSON
      const text2 = await res.text()
      let data = {}
      try {
        data = JSON.parse(text2)
      } catch {
        throw new Error('Réponse invalide du service IA. Réessayez.')
      }

      if (!res.ok) {
        throw new Error(data.error?.message || `Erreur ${res.status}`)
      }

      const reply = data.choices?.[0]?.message?.content
      if (!reply) throw new Error('Réponse vide. Réessayez.')

      const updated = [...newMessages, { role: 'assistant', content: reply }]
      setMessages(updated)
      setStreamTarget(updated.length - 1)
      startTyping(reply, () => setStreamTarget(null))

    } catch (err) {
      console.error('IA error:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatText = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')

  return (
    <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3">

      {/* PANEL CHAT */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl w-80 md:w-96 flex flex-col overflow-hidden"
            style={{
              height: '530px',
              maxHeight: '80vh',
              boxShadow: '0 25px 60px rgba(6,82,128,0.25), 0 0 0 1px rgba(10,105,173,0.1)'
            }}
          >
            {/* HEADER */}
            <div className="relative bg-gradient-to-r from-[#065280] to-[#0A69AD] p-4 flex items-center justify-between shrink-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_rgba(201,162,39,0.15),_transparent_60%)]" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center border border-white/25">
                  <Sparkles className="text-[#C9A227]" size={20} />
                </div>
                <div>
                  <p className="text-white font-black text-sm">Assistant BKSC</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full" />
                    <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wide">
                      IA · Fiscalité & Comptabilité
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-1">
                <button
                  onClick={() => setLangue(l => l === 'fr' ? 'en' : 'fr')}
                  className="text-white/50 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-all"
                  title="Changer la langue"
                >
                  <Globe size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/50 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#F4F6F8] to-white">

              {/* Accueil */}
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#065280] to-[#0A69AD] flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                    <Sparkles className="text-[#C9A227]" size={15} />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[82%]">
                    <p className="text-gray-700 text-xs leading-relaxed">
                      {langue === 'fr' ? (
                        <>👋 Bonjour ! Je suis l'assistant IA de <strong>BK Success Consulting</strong>.<br /><br />
                        Je réponds à vos questions sur la <strong>fiscalité</strong>, la <strong>comptabilité OHADA</strong> et nos <strong>formations</strong>.</>
                      ) : (
                        <>👋 Hello! I'm BK Success Consulting's AI assistant.<br /><br />
                        Ask me about <strong>taxation</strong>, <strong>OHADA accounting</strong> and our <strong>training programs</strong>.</>
                      )}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              {messages.map((msg, i) => {
                const isLastAssistant = i === messages.length - 1 && msg.role === 'assistant'
                const showTyping = isLastAssistant && streamTarget === i
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
                      {showTyping ? (
                        <>
                          <span dangerouslySetInnerHTML={{ __html: formatText(displayed) }} />
                          {isTyping && <span className="inline-block w-0.5 h-3 bg-[#0A69AD] ml-0.5 animate-pulse rounded-full align-middle" />}
                        </>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {/* Loading */}
              {loading && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#065280] to-[#0A69AD] flex items-center justify-center shrink-0 shadow-sm">
                    <Sparkles className="text-[#C9A227]" size={13} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-1.5">
                      {[0, 150, 300].map(d => (
                        <div key={d} className="w-1.5 h-1.5 bg-[#0A69AD]/60 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Erreur */}
              {error && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <span className="text-red-500 text-xs font-black">!</span>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[80%]">
                    <p className="text-red-600 text-xs leading-relaxed">{error}</p>
                    <a href={`https://wa.me/${cabinetInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-[#25D366] hover:underline">
                      💬 Contacter sur WhatsApp <ChevronRight size={10} />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {messages.length === 0 && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-2 pt-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                    {langue === 'fr' ? 'Questions fréquentes' : 'Common questions'}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        onClick={() => send(s.question)}
                        className="group text-left bg-white hover:bg-[#065280] border border-gray-100 hover:border-[#065280] rounded-xl px-2.5 py-2 transition-all shadow-sm"
                      >
                        <span className="text-base block mb-0.5">{s.emoji}</span>
                        <span className="text-[10px] font-bold text-gray-600 group-hover:text-white leading-tight block">{s.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={endRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-2 bg-[#F4F6F8] rounded-xl border border-gray-200 focus-within:border-[#0A69AD] focus-within:ring-2 focus-within:ring-[#0A69AD]/10 transition-all">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder={langue === 'fr' ? 'Votre question fiscale ou comptable…' : 'Your accounting question…'}
                  disabled={loading || isTyping}
                  className="flex-1 bg-transparent text-xs px-3 py-2.5 outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading || isTyping}
                  className="w-8 h-8 bg-[#0A69AD] hover:bg-[#065280] disabled:bg-gray-200 rounded-lg flex items-center justify-center mr-1 transition-colors shrink-0"
                >
                  {loading
                    ? <Loader2 size={13} className="text-white animate-spin" />
                    : <Send size={13} className="text-white" />
                  }
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 px-0.5">
                <p className="text-[9px] text-gray-400">IA DeepSeek · BK Success Consulting</p>
                <a href={`https://wa.me/${cabinetInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="text-[9px] text-[#25D366] font-bold hover:underline flex items-center gap-0.5">
                  <MessageCircle size={9} /> Expert humain
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION */}
      <AnimatePresence>
        {notif && !open && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="relative bg-white text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer max-w-[195px] text-center border border-gray-100"
            style={{ boxShadow: '0 8px 25px rgba(6,82,128,0.15)' }}
          >
            <Sparkles size={11} className="inline text-[#C9A227] mr-1" />
            Une question sur la TVA ou la DSF ?
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOUTON FLOTTANT */}
      <motion.button
        onClick={() => { setOpen(!open); setNotif(false) }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #065280 0%, #0A69AD 100%)',
          boxShadow: '0 8px 25px rgba(6,82,128,0.4)'
        }}
        aria-label="Assistant IA BKSC"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} color="white" />
            </motion.div>
          ) : (
            <motion.div key="ai" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Sparkles size={20} color="#C9A227" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C9A227] rounded-full text-[8px] text-[#065280] font-black flex items-center justify-center shadow-sm">
            IA
          </span>
        )}
        <span className="absolute inset-0 rounded-xl bg-[#0A69AD] animate-ping opacity-15" />
      </motion.button>
    </div>
  )
}