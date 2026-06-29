import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Send,
  Loader2,
  Sparkles,
  User,
  Globe,
  ChevronRight,
  MessageCircle,
} from 'lucide-react'

import { cabinetInfo } from '../data/content'

const SYSTEM_PROMPT = `Tu es l'assistant IA officiel de BK SUCCESS CONSULTING SARL, cabinet comptable basé à Douala, Cameroun.

SERVICES :
- Comptabilité SYSCOHADA
- Fiscalité
- CNPS & Paie
- Création d'entreprise
- Audit
- Conseil en gestion

RÈGLES :
- Réponds toujours en français sauf si l'utilisateur écrit en anglais
- Maximum 150 mots
- si quelqu'un te demande le nom du develloppeur ou du createur de ce site web tu dis que c'est YONTA TSASSE IVAROL
- Ton professionnel et rassurant
- Pour devis complexes → WhatsApp +237 657 37 89 27`

const SUGGESTIONS = [
  {
    emoji: '📊',
    label: 'TVA Cameroun',
    question: 'Comment fonctionne la TVA au Cameroun ?',
  },
  {
    emoji: '🏢',
    label: 'Créer entreprise',
    question: 'Comment créer mon entreprise au Cameroun ?',
  },
  {
    emoji: '📋',
    label: 'DSF',
    question: "C'est quoi la DSF ?",
  },
  {
    emoji: '👥',
    label: 'CNPS',
    question: 'Comment calculer la CNPS ?',
  },
]

function useTypingEffect() {
  const [displayed, setDisplayed] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const timerRef = useRef(null)

  const startTyping = useCallback((text, onDone) => {
    if (timerRef.current) clearTimeout(timerRef.current)

    setDisplayed('')
    setIsTyping(true)

    let i = 0

    const type = () => {
      if (i >= text.length) {
        setIsTyping(false)
        onDone?.()
        return
      }

      setDisplayed(text.slice(0, i + 1))
      i++

      timerRef.current = setTimeout(type, 8)
    }

    type()
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return {
    displayed,
    isTyping,
    startTyping,
  }
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
    endRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, displayed])

  useEffect(() => {
    if (open) {
      setNotif(false)

      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    }
  }, [open])

  const send = async (text = input) => {
    const q = text.trim()

    if (!q || loading || isTyping) return

    setInput('')
    setError(null)

    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: q,
      },
    ]

    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.error || 'Erreur serveur'
        )
      }

      const reply = data.reponse

      if (!reply) {
        throw new Error('Réponse vide')
      }

      const updated = [
        ...newMessages,
        {
          role: 'assistant',
          content: reply,
        },
      ]

      setMessages(updated)
      setLoading(false)

      setStreamTarget(updated.length - 1)

      startTyping(reply, () => {
        setStreamTarget(null)
      })
    } catch (err) {
      console.error(err)

      setError(
        err.message ||
          'Erreur serveur'
      )
    } finally {
      setLoading(false)
    }
  }

  const formatText = (text = '') =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')

  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3">

      {/* ===== CHAT PANEL ===== */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.2,
            }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl w-80 md:w-[420px] flex flex-col overflow-hidden border border-white/20"
            style={{
              height: '560px',
              maxHeight: '85vh',
              boxShadow:
                '0 25px 60px rgba(6,82,128,0.25)',
            }}
          >

            {/* ===== HEADER ===== */}
            <div className="relative bg-gradient-to-r from-[#065280] to-[#0A69AD] p-4 flex items-center justify-between shrink-0 overflow-hidden">

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,_rgba(201,162,39,0.18),_transparent_60%)]" />

              <div className="relative flex items-center gap-3">

                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center">
                  <Sparkles
                    size={20}
                    className="text-[#C9A227]"
                  />
                </div>

                <div>
                  <h3 className="text-white font-black text-sm">
                    Assistant BKSC
                  </h3>

                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full" />

                    <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                      IA Comptable & Fiscalité
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center gap-1">

                <button
                  onClick={() =>
                    setLangue((l) =>
                      l === 'fr' ? 'en' : 'fr'
                    )
                  }
                  className="p-2 rounded-xl hover:bg-white/10 transition"
                >
                  <Globe
                    size={15}
                    className="text-white"
                  />
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition"
                >
                  <X
                    size={18}
                    className="text-white"
                  />
                </button>
              </div>
            </div>

            {/* ===== MESSAGES ===== */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#F4F6F8] to-white space-y-3">

              {messages.length === 0 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex gap-3"
                >

                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#065280] to-[#0A69AD] flex items-center justify-center shrink-0">
                    <Sparkles
                      size={15}
                      className="text-[#C9A227]"
                    />
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[82%]">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      👋 Bonjour ! Je suis
                      l'assistant IA de{' '}
                      <strong>
                        BK Success Consulting
                      </strong>
                      .
                      <br />
                      <br />
                      Je peux vous aider en :
                      <br />
                      • Fiscalité Cameroun
                      <br />
                      • Comptabilité OHADA
                      <br />
                      • Création d'entreprise
                      <br />• DSF & TVA
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ===== HISTORIQUE ===== */}
              {messages.map((msg, i) => {
                const isLastAssistant =
                  i === messages.length - 1 &&
                  msg.role === 'assistant'

                const showTyping =
                  isLastAssistant &&
                  streamTarget === i

                return (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`flex gap-2 ${
                      msg.role === 'user'
                        ? 'flex-row-reverse'
                        : ''
                    }`}
                  >

                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-[#0A69AD]'
                          : 'bg-gradient-to-br from-[#065280] to-[#0A69AD]'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User
                          size={13}
                          className="text-white"
                        />
                      ) : (
                        <Sparkles
                          size={13}
                          className="text-[#C9A227]"
                        />
                      )}
                    </div>

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#0A69AD] text-white rounded-tr-sm'
                          : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'
                      }`}
                    >

                      {showTyping ? (
                        <>
                          <span
                            dangerouslySetInnerHTML={{
                              __html:
                                formatText(
                                  displayed
                                ),
                            }}
                          />

                          {isTyping && (
                            <span className="inline-block w-0.5 h-3 bg-[#0A69AD] ml-1 animate-pulse rounded-full" />
                          )}
                        </>
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              formatText(
                                msg.content
                              ),
                          }}
                        />
                      )}
                    </div>
                  </motion.div>
                )
              })}

              {/* ===== LOADING ===== */}
              {loading && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="flex gap-2"
                >

                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#065280] to-[#0A69AD] flex items-center justify-center">
                    <Sparkles
                      size={13}
                      className="text-[#C9A227]"
                    />
                  </div>

                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <Loader2
                      size={15}
                      className="animate-spin text-[#0A69AD]"
                    />
                  </div>
                </motion.div>
              )}

              {/* ===== ERROR ===== */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-3">
                  <p className="text-red-600 text-xs">
                    {error}
                  </p>

                  <a
                    href={`https://wa.me/${cabinetInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-[#25D366]"
                  >
                    💬 WhatsApp{' '}
                    <ChevronRight size={10} />
                  </a>
                </div>
              )}

              {/* ===== SUGGESTIONS ===== */}
              {messages.length === 0 &&
                !loading && (
                  <div className="grid grid-cols-2 gap-2 pt-2">

                    {SUGGESTIONS.map(
                      (s, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            send(s.question)
                          }
                          className="bg-white hover:bg-[#065280] border border-gray-100 hover:border-[#065280] rounded-xl p-2 text-left transition-all group"
                        >
                          <span className="text-base block">
                            {s.emoji}
                          </span>

                          <span className="text-[10px] font-bold text-gray-600 group-hover:text-white leading-tight">
                            {s.label}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                )}

              <div ref={endRef} />
            </div>

            {/* ===== INPUT ===== */}
            <div className="p-3 bg-white border-t border-gray-100">

              <div className="flex items-center gap-2 bg-[#F4F6F8] border border-gray-200 rounded-2xl px-2">

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      !e.shiftKey
                    ) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder="Votre question comptable..."
                  disabled={loading}
                  className="flex-1 bg-transparent text-xs py-3 outline-none text-gray-700 placeholder-gray-400"
                />

                <button
                  onClick={() => send()}
                  disabled={
                    !input.trim() || loading
                  }
                  className="w-9 h-9 rounded-xl bg-[#0A69AD] hover:bg-[#065280] disabled:bg-gray-300 flex items-center justify-center transition"
                >
                  {loading ? (
                    <Loader2
                      size={14}
                      className="animate-spin text-white"
                    />
                  ) : (
                    <Send
                      size={14}
                      className="text-white"
                    />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 px-1">

                <p className="text-[9px] text-gray-400">
                  IA Gemini • BKSC
                </p>

                <a
                  href={`https://wa.me/${cabinetInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-[#25D366] font-bold flex items-center gap-1"
                >
                  <MessageCircle size={9} />
                  Expert humain
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== NOTIFICATION ===== */}
      <AnimatePresence>
        {notif && !open && (
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 20,
            }}
            onClick={() => setOpen(true)}
            className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold shadow-lg cursor-pointer"
          >
            💬 Une question sur la TVA ?
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FLOAT BUTTON ===== */}
      <motion.button
        onClick={() => {
          setOpen(!open)
          setNotif(false)
        }}
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.95,
        }}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10"
        style={{
          background:
            'linear-gradient(135deg, #065280 0%, #0A69AD 100%)',
          boxShadow:
            '0 10px 30px rgba(6,82,128,0.35)',
        }}
      >

        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{
                rotate: -90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
              exit={{
                rotate: 90,
                opacity: 0,
              }}
            >
              <X
                size={22}
                color="white"
              />
            </motion.div>
          ) : (
            <motion.div
              key="sparkles"
              initial={{
                rotate: 90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
              exit={{
                rotate: -90,
                opacity: 0,
              }}
            >
              <Sparkles
                size={22}
                color="#C9A227"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C9A227] text-[#065280] text-[8px] font-black flex items-center justify-center">
            IA
          </span>
        )}
      </motion.button>
    </div>
  )
}