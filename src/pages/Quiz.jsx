import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Trophy, CheckCircle2, XCircle, ArrowRight,
  RotateCcw, Home, BookOpen, Share2, Zap,
  Star, Crown, Target, TrendingUp,
} from 'lucide-react'
import { categories, questions as questionsHardcoded } from '../data/quizData'
import { store } from '../data/contentStore'
import { cabinetInfo } from '../data/content'

const TEMPS = 30

// ============ TIMER CIRCULAIRE SVG ============
function TimerCircle({ temps, tempsMax }) {
  const rayon = 22
  const circonf = 2 * Math.PI * rayon
  const pourcent = temps / tempsMax
  const offset = circonf * (1 - pourcent)
  const couleur = pourcent > 0.6 ? '#25D366' : pourcent > 0.3 ? '#C9A227' : '#ef4444'

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={rayon} fill="none" stroke="#e5e7eb" strokeWidth="3" />
        <motion.circle
          cx="28" cy="28" r={rayon}
          fill="none"
          stroke={couleur}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circonf}
          strokeDashoffset={offset}
          transition={{ duration: 0.5 }}
          style={{ filter: `drop-shadow(0 0 4px ${couleur}80)` }}
        />
      </svg>
      <motion.span
        className="text-base font-black z-10"
        style={{ color: couleur }}
        animate={{ scale: temps <= 5 ? [1, 1.2, 1] : 1 }}
        transition={{ repeat: temps <= 5 ? Infinity : 0, duration: 0.5 }}
      >
        {temps}
      </motion.span>
    </div>
  )
}

// ============ BADGE ============
function Badge({ score, total }) {
  const pct = (score / total) * 100
  if (pct >= 90) return { emoji: '👑', label: 'Expert', couleur: '#C9A227', bg: 'from-yellow-400/20 to-amber-400/20', border: 'border-yellow-400/30' }
  if (pct >= 75) return { emoji: '🏆', label: 'Excellent', couleur: '#25D366', bg: 'from-green-400/20 to-emerald-400/20', border: 'border-green-400/30' }
  if (pct >= 60) return { emoji: '⭐', label: 'Bien', couleur: '#0A69AD', bg: 'from-blue-400/20 to-cyan-400/20', border: 'border-blue-400/30' }
  if (pct >= 40) return { emoji: '📚', label: 'Passable', couleur: '#f59e0b', bg: 'from-orange-400/20 to-amber-400/20', border: 'border-orange-400/30' }
  return { emoji: '💪', label: 'À revoir', couleur: '#ef4444', bg: 'from-red-400/20 to-rose-400/20', border: 'border-red-400/30' }
}

// ============ ÉCRAN ACCUEIL ============
function EcranAccueil({ onCommencer }) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #065280 0%, #0A69AD 50%, #065280 100%)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_1px,_transparent_1px)] bg-[length:24px_24px]" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#C9A227]/10 blur-[80px] rounded-full" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#0A69AD]/20 blur-[80px] rounded-full" />

      <div className="relative max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl"
          >
            <span className="text-4xl">🧠</span>
          </motion.div>
          <span className="inline-block bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-widest uppercase">
            Quiz Professionnel BKSC
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Testez vos connaissances
          </h1>
          <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
            Comptabilité OHADA · Fiscalité Cameroun · Création d'entreprise · Paie & Social · Audit
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onCommencer(cat.id)}
              className="group relative bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/30 backdrop-blur-md rounded-2xl p-5 text-left transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{cat.emoji}</span>
                  <span className="text-[10px] font-bold text-[#C9A227] bg-[#C9A227]/15 border border-[#C9A227]/25 px-2.5 py-1 rounded-full">
                    {cat.niveau}
                  </span>
                </div>
                <h3 className="text-white font-black text-sm mb-1.5">{cat.titre}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{questionsHardcoded[cat.id]?.length || 0}+ questions</span>
                  <ArrowRight size={14} className="text-[#C9A227] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 flex items-center justify-around text-center mb-8"
        >
          {[
            { icon: '⏱', text: '30s / question' },
            { icon: '✅', text: 'Correction immédiate' },
            { icon: '🏆', text: 'Score & badge' },
            { icon: '💬', text: 'Partage WhatsApp' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-400 text-[10px] font-semibold leading-tight">{item.text}</span>
            </div>
          ))}
        </motion.div>

        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors">
            <Home size={15} /> Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

// ============ ÉCRAN QUIZ ============
function EcranQuiz({ categorieId, onTerminer }) {
  const cat = categories.find(c => c.id === categorieId)
  const [allQuestions, setAllQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [choix, setChoix] = useState(null)
  const [reponses, setReponses] = useState([])
  const [temps, setTemps] = useState(TEMPS)
  const [explication, setExplication] = useState(false)
  const [streak, setStreak] = useState(0)
  const [shakeWrong, setShakeWrong] = useState(false)
  const [glowRight, setGlowRight] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    store.getQuizCustom().then(custom => {
      const base = questionsHardcoded[categorieId] || []
      const extra = custom?.[categorieId] || []
      setAllQuestions([...base, ...extra])
    })
  }, [categorieId])

  const question = allQuestions[index]

  const passerSuivant = useCallback(() => {
    const r = [...reponses, { question, choisie: choix }]
    setReponses(r)
    if (index + 1 >= allQuestions.length) {
      onTerminer(r, cat)
    } else {
      setIndex(i => i + 1)
      setChoix(null)
      setExplication(false)
      setTemps(TEMPS)
      setShakeWrong(false)
      setGlowRight(false)
    }
  }, [index, allQuestions.length, choix, reponses, question, cat, onTerminer])

  useEffect(() => {
    if (!allQuestions.length) return
    if (timerRef.current) clearInterval(timerRef.current)
    setTemps(TEMPS)
    timerRef.current = setInterval(() => {
      setTemps(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (choix === null) { setChoix(-1); setExplication(true) }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [index, allQuestions.length])

  const choisir = (idx) => {
    if (choix !== null || !question) return
    clearInterval(timerRef.current)
    setChoix(idx)
    setExplication(true)
    if (idx === question.reponse) {
      setStreak(s => s + 1)
      setGlowRight(true)
    } else {
      setStreak(0)
      setShakeWrong(true)
      setTimeout(() => setShakeWrong(false), 600)
    }
  }

  if (!allQuestions.length || !question) {
    return (
      <div className="min-h-screen bg-[#065280] flex items-center justify-center pt-24">
        <div className="w-8 h-8 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const getOptionStyle = (idx) => {
    if (choix === null) return 'bg-white/8 border-white/15 hover:bg-white/15 hover:border-white/30 text-white'
    if (idx === question.reponse) return 'bg-green-500/20 border-green-400/50 text-white shadow-[0_0_20px_rgba(37,211,102,0.2)]'
    if (idx === choix && idx !== question.reponse) return 'bg-red-500/20 border-red-400/50 text-white/70'
    return 'bg-white/3 border-white/8 text-white/40'
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #065280 0%, #0A69AD 60%, #065280 100%)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[length:20px_20px]" />

      <div className="relative max-w-xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{cat?.emoji}</span>
              <span className="text-white/80 font-bold text-sm">{cat?.titre}</span>
              {streak >= 2 && (
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="flex items-center gap-1 bg-[#C9A227]/20 border border-[#C9A227]/30 rounded-full px-2 py-0.5"
                >
                  <Zap size={11} className="text-[#C9A227]" />
                  <span className="text-[#C9A227] text-[10px] font-black">{streak}</span>
                </motion.div>
              )}
            </div>
            <TimerCircle temps={temps} tempsMax={TEMPS} />
          </div>

          {/* Barre de progression */}
          <div className="flex gap-1">
            {allQuestions.map((_, i) => (
              <motion.div
                key={i}
                className="h-1.5 flex-1 rounded-full overflow-hidden bg-white/10"
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: i < index ? '100%' : i === index ? '50%' : '0%' }}
                  style={{ backgroundColor: i < index ? '#25D366' : i === index ? '#C9A227' : 'transparent' }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-white/40 text-[10px] font-semibold">Question {index + 1}/{allQuestions.length}</span>
            <span className="text-[#C9A227] text-[10px] font-bold">{reponses.filter(r => r.choisie === r.question?.reponse).length} ✓</span>
          </div>
        </motion.div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.97 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {/* Question */}
            <motion.div
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 mb-4 shadow-xl"
              animate={shakeWrong ? {
                x: [-8, 8, -6, 6, -4, 4, 0],
                transition: { duration: 0.5 }
              } : {}}
            >
              <p className="text-white font-black text-base md:text-lg leading-relaxed">
                {question?.question}
              </p>
            </motion.div>

            {/* Options */}
            <div className="space-y-2.5 mb-4">
              {question?.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: choix === null ? 1.01 : 1 }}
                  whileTap={{ scale: choix === null ? 0.99 : 1 }}
                  animate={
                    glowRight && idx === question.reponse
                      ? { scale: [1, 1.02, 1], transition: { duration: 0.4 } }
                      : {}
                  }
                  onClick={() => choisir(idx)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border backdrop-blur-sm font-semibold text-sm transition-all flex items-center gap-3 ${getOptionStyle(idx)}`}
                >
                  <span className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                    choix !== null && idx === question.reponse ? 'bg-green-500 border-green-500 text-white' :
                    choix !== null && idx === choix && idx !== question.reponse ? 'bg-red-500 border-red-500 text-white' :
                    'border-current'
                  }`}>
                    {choix !== null && idx === question.reponse ? (
                      <CheckCircle2 size={14} />
                    ) : choix !== null && idx === choix && idx !== question.reponse ? (
                      <XCircle size={14} />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </span>
                  <span className="flex-1">{opt}</span>
                </motion.button>
              ))}
            </div>

            {/* Explication */}
            <AnimatePresence>
              {explication && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <div className={`rounded-2xl p-4 mb-4 border backdrop-blur-sm ${
                    choix === question?.reponse
                      ? 'bg-green-500/10 border-green-500/30'
                      : choix === -1
                        ? 'bg-orange-500/10 border-orange-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {choix === question?.reponse ? (
                        <><CheckCircle2 size={16} className="text-green-400" /><p className="text-green-400 font-black text-sm">Bonne réponse !</p></>
                      ) : choix === -1 ? (
                        <><span className="text-orange-400 text-sm">⏰</span><p className="text-orange-400 font-black text-sm">Temps écoulé !</p></>
                      ) : (
                        <><XCircle size={16} className="text-red-400" /><p className="text-red-400 font-black text-sm">Mauvaise réponse</p></>
                      )}
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed">{question?.explication}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={passerSuivant}
                    className="w-full bg-[#C9A227] hover:bg-[#b8932a] text-[#065280] font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-xl shadow-[#C9A227]/20"
                  >
                    {index + 1 >= allQuestions.length ? (
                      <><Trophy size={18} /> Voir mes résultats</>
                    ) : (
                      <>Question suivante <ArrowRight size={18} /></>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============ ÉCRAN RÉSULTATS ============
function EcranResultats({ reponses, categorie, onRecommencer, onChoisirAutre }) {
  const score = reponses.filter(r => r.choisie === r.question?.reponse).length
  const total = reponses.length
  const pct = Math.round((score / total) * 100)
  const badge = Badge({ score, total })

  const messages = {
    90: 'Niveau expert ! Vous maîtrisez parfaitement ce sujet.',
    75: 'Excellente maîtrise ! Quelques points à peaufiner.',
    60: 'Bonne base ! Continuez à pratiquer.',
    40: 'Des lacunes à combler. Une formation vous aiderait.',
    0: 'Pas de panique ! BK Success Consulting vous forme.',
  }
  const getMessage = () => {
    if (pct >= 90) return messages[90]
    if (pct >= 75) return messages[75]
    if (pct >= 60) return messages[60]
    if (pct >= 40) return messages[40]
    return messages[0]
  }

  const partager = () => {
    const msg = `🧠 Quiz BKSC — ${categorie?.titre}\n✅ Score : ${score}/${total} (${pct}%)\n${badge.emoji} ${badge.label}\n\n📚 Boostez vos compétences avec BK Success Consulting !\n📞 +237 657 37 89 27\n🌐 bk-success-consulting.netlify.app/quiz`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const contactExpert = () => {
    const msg = `Bonjour BK Success Consulting, j'ai fait le quiz "${categorie?.titre}" et j'aimerais approfondir mes connaissances avec un expert.`
    window.open(`https://wa.me/${cabinetInfo.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #065280 0%, #0A69AD 60%, #065280 100%)' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[length:20px_20px]" />

      <div className="relative max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header résultats */}
          <div className="relative p-8 text-center overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${badge.bg} opacity-50`} />
            <div className="relative">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
                className="text-6xl mb-3"
              >
                {badge.emoji}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{categorie?.titre}</p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-6xl font-black mb-1"
                  style={{ color: badge.couleur, textShadow: `0 0 30px ${badge.couleur}50` }}
                >
                  {pct}%
                </motion.div>
                <p className="text-white font-black text-xl">{badge.label}</p>
                <p className="text-white/60 text-xs mt-1">{score} / {total} bonnes réponses</p>
              </motion.div>
            </div>
          </div>

          <div className="p-5 space-y-4">

            {/* Message motivationnel */}
            <div className={`bg-gradient-to-r ${badge.bg} border ${badge.border} rounded-2xl p-4`}>
              <p className="text-white/90 text-xs leading-relaxed text-center">{getMessage()}</p>
            </div>

            {/* Barre score */}
            <div>
              <div className="flex justify-between text-xs text-white/50 mb-1.5">
                <span>Score</span><span>{pct}%</span>
              </div>
              <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: badge.couleur, boxShadow: `0 0 10px ${badge.couleur}60` }}
                />
              </div>
            </div>

            {/* Détail réponses */}
            <div className="grid grid-cols-2 gap-2">
              {reponses.map((r, i) => {
                const ok = r.choisie === r.question?.reponse
                return (
                  <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${
                    ok ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                  }`}>
                    {ok
                      ? <CheckCircle2 size={13} className="text-green-400 shrink-0" />
                      : <XCircle size={13} className="text-red-400 shrink-0" />
                    }
                    <span className="text-white/60 truncate">{i + 1}. {r.question?.question?.slice(0, 25)}...</span>
                  </div>
                )
              })}
            </div>

            {/* Recommandation formation si < 75% */}
            {pct < 75 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="bg-[#C9A227]/10 border border-[#C9A227]/25 rounded-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <BookOpen size={18} className="text-[#C9A227] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-black text-xs mb-1">Formation recommandée</p>
                    <p className="text-white/60 text-xs">BK Success Consulting propose des formations certifiantes sur ce thème — dès 110 000 FCFA.</p>
                    <Link to="/formations" className="inline-flex items-center gap-1 mt-2 text-[#C9A227] text-[10px] font-bold hover:underline">
                      Voir les formations <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="space-y-2.5">
              <button onClick={partager}
                className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-lg shadow-[#25D366]/20">
                <Share2 size={16} /> Partager mon score
              </button>
              <button onClick={contactExpert}
                className="w-full bg-[#0A69AD] hover:bg-[#065280] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                <TrendingUp size={16} /> Parler à un expert
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={onRecommencer}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs">
                  <RotateCcw size={14} /> Rejouer
                </button>
                <button onClick={onChoisirAutre}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs">
                  <Star size={14} /> Autre quiz
                </button>
              </div>
              <Link to="/"
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs">
                <Home size={14} /> Retour à l'accueil
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ============ PAGE QUIZ PRINCIPALE ============
export default function Quiz() {
  const [etape, setEtape] = useState('accueil')
  const [categorieId, setCategorieId] = useState(null)
  const [reponsesFin, setReponsesFin] = useState([])
  const [categorieFin, setCategorieFin] = useState(null)

  return (
    <>
      {etape === 'accueil' && <EcranAccueil onCommencer={id => { setCategorieId(id); setEtape('quiz') }} />}
      {etape === 'quiz' && categorieId && (
        <EcranQuiz
          categorieId={categorieId}
          onTerminer={(r, c) => { setReponsesFin(r); setCategorieFin(c); setEtape('resultats') }}
        />
      )}
      {etape === 'resultats' && (
        <EcranResultats
          reponses={reponsesFin}
          categorie={categorieFin}
          onRecommencer={() => setEtape('quiz')}
          onChoisirAutre={() => { setCategorieId(null); setEtape('accueil') }}
        />
      )}
    </>
  )
}