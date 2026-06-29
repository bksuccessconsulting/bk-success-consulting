import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Trophy, Clock, CheckCircle2, XCircle, ArrowRight,
  RotateCcw, Star, Home, BookOpen, Share2,
} from 'lucide-react'
import { categories, questions } from '../data/quizData'
import { cabinetInfo } from '../data/content'

const TEMPS_PAR_QUESTION = 30

// ============ ÉCRAN ACCUEIL ============
function EcranAccueil({ onCommencer }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#065280] to-[#0A69AD] pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="inline-block bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            🧠 Quiz Professionnel BKSC
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
            Quiz Comptables Interactifs
          </h1>
          <p className="text-gray-200 max-w-xl mx-auto text-sm leading-relaxed">
            Testez vos connaissances en comptabilité OHADA, fiscalité camerounaise, création d'entreprise et gestion sociale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCommencer(cat.id)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-sm rounded-2xl p-5 text-left transition-all group"
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h3 className="text-white font-black text-base mb-1">{cat.titre}</h3>
              <p className="text-gray-300 text-xs mb-3 leading-relaxed">{cat.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#C9A227] bg-[#C9A227]/15 px-2.5 py-1 rounded-full">
                  {cat.niveau}
                </span>
                <span className="text-gray-400 text-xs">
                  {questions[cat.id]?.length || 0} questions
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center max-w-md mx-auto"
        >
          <p className="text-gray-300 text-xs mb-2">⏱ {TEMPS_PAR_QUESTION} secondes par question</p>
          <p className="text-gray-300 text-xs mb-2">📊 Score et correction immédiate</p>
          <p className="text-gray-300 text-xs">🏆 Partage de résultats sur WhatsApp</p>
        </motion.div>

        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            <Home size={16} /> Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

// ============ BARRE DE PROGRESSION TIMER ============
function TimerBar({ temps, tempsMax }) {
  const pourcent = (temps / tempsMax) * 100
  const couleur = pourcent > 50 ? '#25D366' : pourcent > 25 ? '#C9A227' : '#ef4444'
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <motion.div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${pourcent}%`, backgroundColor: couleur }}
      />
    </div>
  )
}

// ============ ÉCRAN QUIZ ============
function EcranQuiz({ categorieId, onTerminer }) {
  const cat = categories.find(c => c.id === categorieId)
  const qs = questions[categorieId] || []
  const [index, setIndex] = useState(0)
  const [reponseChoisie, setReponseChoisie] = useState(null)
  const [reponses, setReponses] = useState([])
  const [temps, setTemps] = useState(TEMPS_PAR_QUESTION)
  const [montrerExplication, setMontrerExplication] = useState(false)
  const timerRef = useRef(null)

  const question = qs[index]

  const passerSuivant = useCallback(() => {
    const r = [...reponses, { question: question, choisie: reponseChoisie }]
    setReponses(r)

    if (index + 1 >= qs.length) {
      onTerminer(r, cat)
    } else {
      setIndex(i => i + 1)
      setReponseChoisie(null)
      setMontrerExplication(false)
      setTemps(TEMPS_PAR_QUESTION)
    }
  }, [index, qs.length, reponseChoisie, reponses, question, cat, onTerminer])

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTemps(TEMPS_PAR_QUESTION)

    timerRef.current = setInterval(() => {
      setTemps(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          if (reponseChoisie === null) {
            setReponseChoisie(-1)
            setMontrerExplication(true)
          }
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [index])

  const choisir = (idx) => {
    if (reponseChoisie !== null) return
    clearInterval(timerRef.current)
    setReponseChoisie(idx)
    setMontrerExplication(true)
  }

  const getCouleurOption = (idx) => {
    if (reponseChoisie === null) return 'bg-white border-gray-200 hover:border-[#0A69AD] hover:bg-[#F4F6F8] text-gray-700'
    if (idx === question.reponse) return 'bg-green-50 border-green-400 text-green-800'
    if (idx === reponseChoisie && idx !== question.reponse) return 'bg-red-50 border-red-400 text-red-800'
    return 'bg-white border-gray-100 text-gray-400'
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{cat?.emoji}</span>
              <span className="font-bold text-[#065280] text-sm">{cat?.titre}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className={temps <= 10 ? 'text-red-500' : 'text-gray-400'} />
              <span className={`text-sm font-black ${temps <= 10 ? 'text-red-500' : 'text-gray-600'}`}>
                {temps}s
              </span>
            </div>
          </div>
          <TimerBar temps={temps} tempsMax={TEMPS_PAR_QUESTION} />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">Question {index + 1} / {qs.length}</span>
            <div className="flex gap-1">
              {qs.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${
                  i < index ? 'bg-[#0A69AD]' : i === index ? 'bg-[#C9A227]' : 'bg-gray-200'
                }`} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
              <p className="text-[#065280] font-black text-base md:text-lg leading-relaxed">
                {question?.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-4">
              {question?.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: reponseChoisie === null ? 1.01 : 1 }}
                  whileTap={{ scale: reponseChoisie === null ? 0.99 : 1 }}
                  onClick={() => choisir(idx)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 font-semibold text-sm transition-all flex items-center gap-3 ${getCouleurOption(idx)}`}
                >
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center shrink-0 text-xs font-black">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                  {reponseChoisie !== null && idx === question.reponse && (
                    <CheckCircle2 size={18} className="text-green-500 ml-auto shrink-0" />
                  )}
                  {reponseChoisie !== null && idx === reponseChoisie && idx !== question.reponse && (
                    <XCircle size={18} className="text-red-500 ml-auto shrink-0" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Explication */}
            <AnimatePresence>
              {montrerExplication && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <div className={`rounded-xl p-4 mb-4 border ${
                    reponseChoisie === question?.reponse
                      ? 'bg-green-50 border-green-200'
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <p className="font-black text-sm mb-1">
                      {reponseChoisie === question?.reponse ? '✅ Bonne réponse !' : '❌ Mauvaise réponse'}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{question?.explication}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={passerSuivant}
                    className="w-full bg-[#065280] hover:bg-[#0A69AD] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    {index + 1 >= qs.length ? (
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
  const score = reponses.filter(r => r.choisie === r.question.reponse).length
  const total = reponses.length
  const pourcentage = Math.round((score / total) * 100)

  const getMention = () => {
    if (pourcentage >= 90) return { texte: 'Excellent ! 🏆', couleur: '#25D366', desc: 'Niveau expert' }
    if (pourcentage >= 75) return { texte: 'Très Bien ! ⭐', couleur: '#C9A227', desc: 'Bonne maîtrise' }
    if (pourcentage >= 60) return { texte: 'Bien ! 👍', couleur: '#0A69AD', desc: 'Des bases solides' }
    if (pourcentage >= 40) return { texte: 'Passable 📚', couleur: '#f59e0b', desc: 'À approfondir' }
    return { texte: 'À améliorer 💪', couleur: '#ef4444', desc: 'Formation recommandée' }
  }

  const mention = getMention()

  const partagerWhatsApp = () => {
    const msg = `🧠 Quiz BKSC — ${categorie?.titre}\n\n✅ Score : ${score}/${total} (${pourcentage}%)\n🏅 Mention : ${mention.texte}\n\n💡 Améliorez vos compétences avec les formations de BK Success Consulting !\n📞 +237 657 37 89 27\n🌐 bk-success-consulting.netlify.app`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#065280] to-[#0A69AD] pt-24 pb-12 px-4">
      <div className="max-w-xl mx-auto">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header résultats */}
          <div className="p-8 text-center" style={{ background: `linear-gradient(135deg, #065280, #0A69AD)` }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
              className="w-24 h-24 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30"
            >
              <span className="text-4xl">{categorie?.emoji}</span>
            </motion.div>
            <h2 className="text-white font-black text-2xl mb-1">Quiz Terminé !</h2>
            <p className="text-white/70 text-sm">{categorie?.titre}</p>
          </div>

          {/* Score */}
          <div className="p-8">
            <div className="text-center mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl font-black mb-2"
                style={{ color: mention.couleur }}
              >
                {pourcentage}%
              </motion.div>
              <p className="font-black text-lg text-gray-800">{mention.texte}</p>
              <p className="text-gray-500 text-sm">{mention.desc}</p>
              <p className="text-gray-500 text-sm mt-1">{score} bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur {total}</p>
            </div>

            {/* Barre de score */}
            <div className="bg-gray-100 rounded-full h-4 mb-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pourcentage}%` }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: mention.couleur }}
              />
            </div>

            {/* Détail questions */}
            <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
              {reponses.map((r, i) => {
                const correct = r.choisie === r.question.reponse
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-xs ${correct ? 'bg-green-50' : 'bg-red-50'}`}>
                    {correct
                      ? <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                      : <XCircle size={16} className="text-red-500 shrink-0" />
                    }
                    <span className="text-gray-600 truncate">{r.question.question}</span>
                  </div>
                )
              })}
            </div>

            {/* Recommandation formation */}
            {pourcentage < 75 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="bg-[#F4F6F8] border border-[#0A69AD]/20 rounded-2xl p-4 mb-5"
              >
                <div className="flex items-start gap-3">
                  <BookOpen size={20} className="text-[#0A69AD] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-[#065280] text-sm">Améliorez vos compétences</p>
                    <p className="text-gray-500 text-xs mt-0.5">BK Success Consulting propose des formations certifiantes sur ce thème.</p>
                    <Link to="/formations" className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#0A69AD] hover:underline">
                      Voir les formations <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={partagerWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <Share2 size={16} /> Partager sur WhatsApp
              </button>
              <button
                onClick={onRecommencer}
                className="w-full bg-[#065280] hover:bg-[#0A69AD] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <RotateCcw size={16} /> Recommencer ce quiz
              </button>
              <button
                onClick={onChoisirAutre}
                className="w-full bg-[#F4F6F8] hover:bg-gray-200 text-[#065280] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <Star size={16} /> Choisir une autre catégorie
              </button>
              <Link
                to="/"
                className="w-full bg-white border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm hover:bg-gray-50"
              >
                <Home size={16} /> Retour à l'accueil
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

  const commencer = (id) => {
    setCategorieId(id)
    setEtape('quiz')
  }

  const terminer = (reps, cat) => {
    setReponsesFin(reps)
    setCategorieFin(cat)
    setEtape('resultats')
  }

  const recommencer = () => {
    setEtape('quiz')
  }

  const choisirAutre = () => {
    setCategorieId(null)
    setEtape('accueil')
  }

  return (
    <>
      {etape === 'accueil' && <EcranAccueil onCommencer={commencer} />}
      {etape === 'quiz' && categorieId && (
        <EcranQuiz categorieId={categorieId} onTerminer={terminer} />
      )}
      {etape === 'resultats' && (
        <EcranResultats
          reponses={reponsesFin}
          categorie={categorieFin}
          onRecommencer={recommencer}
          onChoisirAutre={choisirAutre}
        />
      )}
    </>
  )
}