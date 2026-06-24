import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator, FileText, Users, Scale, Search, Lightbulb,
  ArrowRight, CheckCircle2, GraduationCap, ChevronDown, Quote, Heart,
  Award, BookOpen, Lock, Headphones, Clock, Star,
  ChevronLeft, ChevronRight, ImageIcon,
} from 'lucide-react'
import { cabinetInfo, stats, valeurs } from '../data/content'
import { store } from '../data/contentStore'
import heroVideoLocal from '../assets/hero.mp4'

const iconMap = { Calculator, FileText, Users, Scale, Search, Lightbulb }

// ============ COMPTEUR ANIMÉ ============
function AnimatedCounter({ value, suffixe }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  const isNumber = typeof value === 'number'

  useEffect(() => {
    if (!isNumber || started.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let current = 0
        const steps = Math.min(value, 80)
        const increment = Math.ceil(value / steps)
        const stepTime = Math.floor(1500 / steps)
        const timer = setInterval(() => {
          current += increment
          if (current >= value) { setCount(value); clearInterval(timer) }
          else setCount(current)
        }, stepTime)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, isNumber])

  return <span ref={ref}>{isNumber ? count : value}{suffixe}</span>
}

// ============ ÉTOILES ============
function Stars({ note = 5, size = 14 }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size}
          className={s <= (note || 5) ? 'text-[#C9A227] fill-[#C9A227]' : 'text-gray-400 fill-gray-400'} />
      ))}
    </div>
  )
}

// ============ CAROUSEL TÉMOIGNAGES ============
function TestimonialsCarousel({ temoignages }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (temoignages.length <= 1) return
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent(c => (c + 1) % temoignages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [temoignages.length])

  const prev = () => {
    setDirection(-1)
    setCurrent(c => (c - 1 + temoignages.length) % temoignages.length)
  }
  const next = () => {
    setDirection(1)
    setCurrent(c => (c + 1) % temoignages.length)
  }

  if (temoignages.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-lg mx-auto text-center">
        <Heart className="text-[#C9A227] mx-auto mb-4" size={36} />
        <p className="text-gray-300 text-sm">Nos témoignages clients seront publiés très prochainement.</p>
      </div>
    )
  }

  const t = temoignages[current]

  return (
    <div className="relative max-w-2xl mx-auto px-8">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 60 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden border-2 border-[#C9A227] bg-[#0A69AD] flex items-center justify-center">
            {t.photo
              ? <img src={t.photo} alt={t.nom} className="w-full h-full object-cover" />
              : <Users className="text-white" size={24} />
            }
          </div>
          <Stars note={t.note || 5} />
          <Quote className="text-[#C9A227] mx-auto my-4" size={28} />
          <p className="text-gray-200 text-sm leading-relaxed italic mb-5">"{t.texte}"</p>
          <p className="text-white font-black text-sm">{t.nom}</p>
          {t.entreprise && <p className="text-[#C9A227] text-xs mt-0.5 font-semibold">{t.entreprise}</p>}
        </motion.div>
      </AnimatePresence>

      {temoignages.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#C9A227] text-white hover:text-[#065280] w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#C9A227] text-white hover:text-[#065280] w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110">
            <ChevronRight size={18} />
          </button>
          <div className="flex justify-center gap-2 mt-5">
            {temoignages.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-[#C9A227] w-6' : 'bg-white/30 w-2 hover:bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============ PAGE HOME ============
export default function Home() {
  const [services, setServices] = useState([])
  const [formations, setFormations] = useState([])
  const [temoignages, setTemoignages] = useState([])
  const [galerie, setGalerie] = useState([])
  const [heroVideoUrl, setHeroVideoUrl] = useState(heroVideoLocal)

  useEffect(() => {
    let actif = true
    Promise.all([
      store.getServices(),
      store.getFormations(),
      store.getTemoignages(),
      store.getMedia(),
      store.getGalerie(),
    ]).then(([s, f, t, m, g]) => {
      if (!actif) return
      setServices(s || [])
      setFormations(f || [])
      setTemoignages(t || [])
      setGalerie(g || [])
      if (m?.heroVideoUrl && m.heroVideoUrl.trim() !== '') setHeroVideoUrl(m.heroVideoUrl)
    })
    return () => { actif = false }
  }, [])

  const engagements = [
    { icon: Award, titre: "Cabinet Agréé", desc: "Reconnu et enregistré selon le droit OHADA et les normes camerounaises." },
    { icon: BookOpen, titre: "Expertise OHADA", desc: "Maîtrise complète du SYSCOHADA révisé et de ses évolutions réglementaires." },
    { icon: Headphones, titre: "Accompagnement", desc: "Un interlocuteur dédié pour chaque client, disponible et à l'écoute." },
    { icon: Clock, titre: "Réactivité", desc: "Réponse rapide à vos questions, respect strict de vos délais fiscaux." },
    { icon: Lock, titre: "Confidentialité", desc: "Secret professionnel absolu sur toutes vos données et informations sensibles." },
  ]

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative h-screen flex items-end overflow-hidden bg-[#065280]">
        <video
          key={heroVideoUrl}
          autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-[1]" style={{
          background: 'linear-gradient(to top, rgba(6,82,128,0.95) 0%, rgba(6,82,128,0.6) 35%, rgba(6,82,128,0.1) 70%, transparent 100%)'
        }} />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#065280]/30 to-transparent z-[1]" />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#C9A227]/10 blur-[120px] rounded-full z-[1]" />

        <div className="relative z-10 w-full pb-14 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 md:px-10">

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="flex items-center gap-2 mb-5"
            >
              <div className="h-px w-8 bg-[#C9A227]" />
              <span className="bg-[#C9A227] text-[#065280] px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-lg">
                Cabinet agréé · Droit OHADA · Depuis {cabinetInfo.anneeFondation}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-5 max-w-3xl"
              style={{ textShadow: '0 4px 40px rgba(0,0,0,0.3)' }}
            >
              {cabinetInfo.slogan}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-white/75 max-w-xl mb-8 leading-relaxed"
            >
              {cabinetInfo.accroche}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/contact"
                className="bg-[#C9A227] hover:bg-[#b8932a] text-[#065280] font-black px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-2xl text-sm group">
                Demander un devis
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/services"
                className="bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-sm text-white font-bold px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all text-sm hover:border-white/50">
                Découvrir nos services <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Indicateurs de confiance */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              {['RCCM Enregistré', 'SYSCOHADA Maîtrisé', 'Secret Professionnel', '4+ modules certifiants'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-white/60 text-xs">
                  <CheckCircle2 size={12} className="text-[#C9A227]" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <a href="#engagements" className="absolute bottom-6 right-10 text-white/40 hover:text-white/70 animate-bounce z-10 transition-colors">
          <ChevronDown size={26} />
        </a>
      </section>

      {/* ============ NOS ENGAGEMENTS (NOUVEAU) ============ */}
      <section id="engagements" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Pourquoi nous faire confiance</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#065280] mt-2">Nos Engagements</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
              {cabinetInfo.baseline}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {engagements.map((eng, i) => {
              const Icon = eng.icon
              return (
                <motion.div
                  key={eng.titre}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group relative bg-gradient-to-br from-[#F4F6F8] to-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-xl hover:border-[#0A69AD]/30 hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0A69AD]/0 to-[#065280]/0 group-hover:from-[#0A69AD]/5 group-hover:to-[#065280]/5 transition-all duration-300 rounded-2xl" />
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0A69AD] to-[#065280] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="text-white" size={22} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C9A227] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <h4 className="font-black text-[#065280] text-sm mb-2">{eng.titre}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{eng.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section id="stats" className="bg-gradient-to-r from-[#065280] to-[#0A69AD] py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="text-3xl md:text-5xl font-black text-[#C9A227] mb-2">
                <AnimatedCounter value={stat.valeur} suffixe={stat.suffixe} />
              </div>
              <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="bg-[#F4F6F8] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Nos expertises</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#065280] mt-2">Nos Services</h2>
            <p className="text-gray-500 text-sm mt-2">Un accompagnement complet pour toutes vos obligations professionnelles</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icone] || Calculator
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#0A69AD]/20 group hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#F4F6F8] to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-14 h-14 bg-gradient-to-br from-[#0A69AD] to-[#065280] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 shadow-md">
                    <Icon className="text-white" size={26} />
                  </div>
                  <h3 className="text-xl font-black text-[#065280] mb-2">{service.titre}</h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{service.accroche}</p>
                  <Link to="/services"
                    className="inline-flex items-center gap-1.5 text-[#0A69AD] font-bold text-sm group-hover:gap-2.5 transition-all border-b border-transparent group-hover:border-[#0A69AD] pb-0.5">
                    En savoir plus <ArrowRight size={14} />
                  </Link>
                </motion.div>
              )
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/services"
              className="inline-flex items-center gap-2 bg-[#065280] hover:bg-[#0A69AD] text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 text-sm hover:scale-105 shadow-lg">
              Voir tous nos services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ VALEURS ============ */}
      <section className="bg-[#0A69AD] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:24px_24px]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Ce qui nous distingue</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Nos Valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {valeurs.map((valeur, i) => (
              <motion.div key={valeur.titre} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 text-center transition-all duration-300 group hover:-translate-y-1 cursor-default">
                <div className="w-11 h-11 bg-[#C9A227] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                  <CheckCircle2 className="text-[#065280]" size={20} />
                </div>
                <h4 className="text-white font-black text-sm mb-2">{valeur.titre}</h4>
                <p className="text-gray-300 text-xs leading-relaxed">{valeur.texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FORMATIONS ============ */}
      <section className="bg-[#F4F6F8] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Pôle Formation BKSC</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#065280] mt-2">Nos Formations Certifiantes</h2>
            <p className="text-gray-500 text-sm mt-2">On apprend à faire, pas à savoir — Attestation BKSC avec mention</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formations.map((formation, i) => (
              <motion.div key={formation.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#0A69AD]/20 flex flex-col group hover:-translate-y-1">
                <div className="bg-gradient-to-br from-[#065280] to-[#0A69AD] p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
                  <GraduationCap className="text-[#C9A227] mb-2 relative z-10" size={28} />
                  <h3 className="text-white font-black text-sm leading-snug relative z-10">{formation.titre}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-gray-500 text-xs mb-4 flex-1 leading-relaxed">{formation.accroche}</p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400 mb-1">À partir de</p>
                    <p className="text-[#C9A227] font-black text-xl mb-3">{formation.tarifs?.[0]?.prix || '—'}</p>
                    <Link to="/formations"
                      className="w-full bg-[#065280] hover:bg-[#0A69AD] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all group-hover:gap-2.5">
                      Voir le programme <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TÉMOIGNAGES CAROUSEL (NOUVEAU) ============ */}
      <section className="bg-[#065280] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.08)_0%,_transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Ce qu'ils disent</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Ils nous font confiance</h2>
            <p className="text-gray-400 text-sm mt-2">L'excellence de notre service, vue par nos clients</p>
          </div>
          <TestimonialsCarousel temoignages={temoignages} />
        </div>
      </section>

      {/* ============ GALERIE (NOUVEAU) ============ */}
      {galerie.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Notre cabinet en images</span>
              <h2 className="text-3xl font-black text-[#065280] mt-2">Galerie</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {galerie.slice(0, 8).map((item, i) => (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative group overflow-hidden rounded-xl aspect-square bg-gray-100"
                >
                  <img src={item.url} alt={item.caption || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {item.caption && (
                    <div className="absolute inset-0 bg-[#065280]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <p className="text-white text-xs p-3 font-semibold">{item.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA FINAL ============ */}
      <section className="bg-[#C9A227] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(6,82,128,0.15)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-[#065280] mb-4">
            Prêt à faire passer votre gestion au niveau supérieur ?
          </h2>
          <p className="text-[#065280]/70 mb-8 max-w-xl mx-auto">
            Contactez-nous dès aujourd'hui pour un accompagnement sur mesure. Premier entretien gratuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#065280] hover:bg-[#0A69AD] text-white font-black px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-xl">
              Contactez-nous <ArrowRight size={18} />
            </Link>
            <Link to="/formations"
              className="inline-flex items-center justify-center gap-2 bg-white/30 hover:bg-white/50 text-[#065280] font-bold px-8 py-4 rounded-xl transition-all duration-200">
              Nos formations <GraduationCap size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}