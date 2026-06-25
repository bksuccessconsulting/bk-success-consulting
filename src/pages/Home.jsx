import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Calculator, FileText, Users, Scale, Search, Lightbulb,
  ArrowRight, CheckCircle2, GraduationCap, Quote, Heart,
  Award, BookOpen, Lock, Headphones, Clock, Star,
  ChevronLeft, ChevronRight, ChevronDown, Sparkles,
  TrendingUp, Shield, Globe,
} from 'lucide-react'
import { cabinetInfo, stats, valeurs } from '../data/content'
import { store } from '../data/contentStore'
import heroVideoLocal from '../assets/hero.mp4'

const iconMap = { Calculator, FileText, Users, Scale, Search, Lightbulb }

// ============ ANIMATED COUNTER ============
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
        const timer = setInterval(() => {
          current += increment
          if (current >= value) { setCount(value); clearInterval(timer) }
          else setCount(current)
        }, Math.floor(1500 / steps))
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, isNumber])

  return <span ref={ref}>{isNumber ? count : value}{suffixe}</span>
}

// ============ STARS ============
function Stars({ note = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={13} className={s <= (note || 5) ? 'text-[#C9A227] fill-[#C9A227]' : 'text-gray-300'} />
      ))}
    </div>
  )
}

// ============ TESTIMONIAL CAROUSEL ============
function TestimonialsCarousel({ temoignages }) {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)

  useEffect(() => {
    if (temoignages.length <= 1) return
    const t = setInterval(() => { setDir(1); setCurrent(c => (c + 1) % temoignages.length) }, 5500)
    return () => clearInterval(t)
  }, [temoignages.length])

  const prev = () => { setDir(-1); setCurrent(c => (c - 1 + temoignages.length) % temoignages.length) }
  const next = () => { setDir(1); setCurrent(c => (c + 1) % temoignages.length) }

  if (temoignages.length === 0) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
          <Heart className="text-[#C9A227] mx-auto mb-4" size={36} />
          <p className="text-gray-300 text-sm">Nos témoignages clients seront publiés très prochainement.</p>
        </div>
      </div>
    )
  }

  const t = temoignages[current]

  return (
    <div className="relative max-w-xl mx-auto px-10">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={current} custom={dir}
          initial={{ opacity: 0, x: dir * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -dir * 60 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden border-2 border-[#C9A227] bg-[#0A69AD] flex items-center justify-center">
            {t.photo ? <img src={t.photo} alt={t.nom} className="w-full h-full object-cover" /> : <Users className="text-white" size={24} />}
          </div>
          <Stars note={t.note || 5} />
          <div className="text-[#C9A227]/60 text-5xl font-serif mt-4 mb-2 leading-none">"</div>
          <p className="text-gray-200 text-sm leading-relaxed italic mb-5">{t.texte}</p>
          <p className="text-white font-black text-sm">{t.nom}</p>
          {t.entreprise && <p className="text-[#C9A227] text-xs mt-0.5 font-semibold">{t.entreprise}</p>}
        </motion.div>
      </AnimatePresence>

      {temoignages.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/10 hover:bg-[#C9A227] text-white hover:text-[#065280] rounded-full flex items-center justify-center transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/10 hover:bg-[#C9A227] text-white hover:text-[#065280] rounded-full flex items-center justify-center transition-all">
            <ChevronRight size={18} />
          </button>
          <div className="flex justify-center gap-1.5 mt-5">
            {temoignages.map((_, i) => (
              <button key={i} onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i) }}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-[#C9A227] w-5' : 'bg-white/30 w-1.5'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ============ HOME PAGE ============
export default function Home() {
  const [services, setServices] = useState([])
  const [formations, setFormations] = useState([])
  const [temoignages, setTemoignages] = useState([])
  const [galerie, setGalerie] = useState([])
  const [heroVideoUrl, setHeroVideoUrl] = useState(heroVideoLocal)

  useEffect(() => {
    let actif = true
    Promise.all([
      store.getServices(), store.getFormations(),
      store.getTemoignages(), store.getMedia(), store.getGalerie()
    ]).then(([s, f, t, m, g]) => {
      if (!actif) return
      setServices(s || []); setFormations(f || [])
      setTemoignages(t || []); setGalerie(g || [])
      if (m?.heroVideoUrl?.trim()) setHeroVideoUrl(m.heroVideoUrl)
    })
    return () => { actif = false }
  }, [])

  const engagements = [
    { icon: Award, titre: "Cabinet Agréé", desc: "Enregistré RCCM, reconnu selon le droit OHADA et normes camerounaises." },
    { icon: BookOpen, titre: "Expertise OHADA", desc: "Maîtrise complète du SYSCOHADA révisé et de ses évolutions réglementaires." },
    { icon: Headphones, titre: "Accompagnement", desc: "Un interlocuteur dédié pour chaque client, disponible et à l'écoute." },
    { icon: Clock, titre: "Réactivité", desc: "Réponse rapide à vos questions, respect strict de vos délais fiscaux." },
    { icon: Lock, titre: "Confidentialité", desc: "Secret professionnel absolu sur toutes vos données sensibles." },
  ]

  return (
    <div>
      {/* ============ HERO ULTRA PREMIUM ============ */}
      <section className="relative h-screen flex items-end overflow-hidden bg-[#065280]">

        {/* Vidéo */}
        <video
          key={heroVideoUrl}
          autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>

        {/* Overlays progressifs */}
        <div className="absolute inset-0 z-[1]" style={{
          background: 'linear-gradient(135deg, rgba(6,82,128,0.7) 0%, rgba(6,82,128,0.4) 40%, rgba(6,82,128,0.1) 70%, transparent 100%)'
        }} />
        <div className="absolute inset-0 z-[1]" style={{
          background: 'linear-gradient(to top, rgba(6,82,128,0.98) 0%, rgba(6,82,128,0.7) 25%, rgba(6,82,128,0.2) 55%, transparent 80%)'
        }} />

        {/* Effets lumineux décoratifs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A227]/8 blur-[120px] rounded-full z-[1] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#0A69AD]/15 blur-[100px] rounded-full z-[1]" />

        {/* Contenu hero */}
        <div className="relative z-10 w-full pb-14 md:pb-20">
          <div className="max-w-7xl mx-auto px-6 md:px-10">

            {/* Badge premium glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-5"
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                <Shield size={13} className="text-[#C9A227]" />
                <span className="text-white/90 text-xs font-bold tracking-wider">CABINET CERTIFIÉ OHADA · DEPUIS {cabinetInfo.anneeFondation}</span>
              </div>
            </motion.div>

            {/* Titre ultra impactant */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-5 max-w-3xl"
              style={{ textShadow: '0 4px 40px rgba(0,0,0,0.3)' }}
            >
              {cabinetInfo.slogan}
              <span className="block text-[#C9A227] mt-1" style={{ fontSize: '0.6em' }}>
                — {cabinetInfo.sloganAlternatif}
              </span>
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base text-white/70 max-w-xl mb-8 leading-relaxed"
            >
              {cabinetInfo.accroche}
            </motion.p>

            {/* CTAs premium glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link to="/contact"
                className="group relative bg-[#C9A227] hover:bg-[#b8932a] text-[#065280] font-black px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all text-sm shadow-2xl hover:shadow-[#C9A227]/30 hover:scale-105 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                <span className="relative">Demander un devis</span>
                <ArrowRight size={16} className="relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/services"
                className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-sm text-white font-bold px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all text-sm hover:scale-105"
              >
                <Globe size={15} />
                Découvrir nos services
              </Link>
            </motion.div>

            {/* Indicateurs glassmorphism */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: TrendingUp, label: '+100 clients accompagnés' },
                { icon: Shield, label: 'RCCM · NIU certifiés' },
                { icon: BookOpen, label: '4 formations certifiantes' },
                { icon: Sparkles, label: 'IA comptable intégrée' },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.08 }}
                    className="flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-1.5"
                  >
                    <Icon size={11} className="text-[#C9A227]" />
                    <span className="text-white/70 text-xs font-semibold">{item.label}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 right-8 z-10 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        >
          <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase rotate-90 mb-2">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* ============ ENGAGEMENTS PREMIUM ============ */}
      <section className="bg-white py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Pourquoi nous choisir</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#065280] mt-2">Nos Engagements</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">{cabinetInfo.baseline}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {engagements.map((eng, i) => {
              const Icon = eng.icon
              return (
                <motion.div
                  key={eng.titre}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative bg-gradient-to-br from-[#F4F6F8] to-white border border-gray-100 rounded-2xl p-6 text-center cursor-default overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0A69AD]/0 to-[#065280]/0 group-hover:from-[#0A69AD]/3 group-hover:to-[#065280]/5 transition-all duration-500 rounded-2xl" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{
                    boxShadow: 'inset 0 0 20px rgba(10,105,173,0.08)'
                  }} />
                  <div className="relative">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-[#0A69AD] to-[#065280] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="text-white" size={22} />
                    </motion.div>
                    <h4 className="font-black text-[#065280] text-sm mb-2">{eng.titre}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{eng.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ STATS PREMIUM ============ */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#065280] via-[#0A69AD] to-[#065280]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.06)_1px,_transparent_1px)] bg-[length:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,162,39,0.12)_0%,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="text-4xl md:text-6xl font-black text-[#C9A227] mb-2 transition-transform group-hover:scale-110 duration-300">
                <AnimatedCounter value={stat.valeur} suffixe={stat.suffixe} />
              </div>
              <div className="text-gray-300 text-sm font-semibold">{stat.label}</div>
              <div className="w-8 h-0.5 bg-[#C9A227]/40 mx-auto mt-3 group-hover:w-12 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ SERVICES PREMIUM ============ */}
      <section className="bg-[#F4F6F8] py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0A69AD]/3 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Nos expertises</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#065280] mt-2">Nos Services</h2>
            <p className="text-gray-400 text-sm mt-2">Un accompagnement complet pour toutes vos obligations professionnelles</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => {
              const Icon = iconMap[service.icone] || Calculator
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#0A69AD]/20 relative overflow-hidden cursor-default"
                  style={{ boxShadow: '0 2px 15px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 20px 60px rgba(10,105,173,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.04)'}
                >
                  {/* Glow en hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0A69AD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-3xl" />
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#C9A227]/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-[#0A69AD] to-[#065280] rounded-xl flex items-center justify-center mb-5 shadow-lg relative"
                    whileHover={{ rotate: 6, scale: 1.1 }}
                  >
                    <Icon className="text-white" size={26} />
                    <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                  <h3 className="text-xl font-black text-[#065280] mb-2 group-hover:text-[#0A69AD] transition-colors">{service.titre}</h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{service.accroche}</p>
                  <Link to="/services"
                    className="inline-flex items-center gap-1.5 text-[#0A69AD] font-bold text-sm group-hover:gap-3 transition-all relative"
                  >
                    <span>En savoir plus</span>
                    <ArrowRight size={14} />
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#0A69AD] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/services"
              className="inline-flex items-center gap-2 bg-[#065280] hover:bg-[#0A69AD] text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm hover:scale-105 shadow-lg hover:shadow-[#065280]/30"
            >
              Voir tous nos services <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============ VALEURS PREMIUM ============ */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#0A69AD]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_1px,_transparent_1px)] bg-[length:20px_20px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Ce qui nous distingue</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Nos Valeurs</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {valeurs.map((valeur, i) => (
              <motion.div
                key={valeur.titre}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5 }}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-5 text-center transition-all cursor-default"
              >
                <motion.div className="w-11 h-11 bg-[#C9A227] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg" whileHover={{ scale: 1.15, rotate: 5 }}>
                  <CheckCircle2 className="text-[#065280]" size={20} />
                </motion.div>
                <h4 className="text-white font-black text-sm mb-2">{valeur.titre}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{valeur.texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FORMATIONS PREMIUM ============ */}
      <section className="bg-[#F4F6F8] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Pôle Formation BKSC</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#065280] mt-2">Nos Formations Certifiantes</h2>
            <p className="text-gray-400 text-sm mt-2">On apprend à faire, pas à savoir · Attestation avec mention</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {formations.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#0A69AD]/20 flex flex-col relative"
                style={{ boxShadow: '0 2px 15px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 20px 50px rgba(10,105,173,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.04)'}
              >
                <div className="bg-gradient-to-br from-[#065280] to-[#0A69AD] p-5 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#C9A227]/10 rounded-full" />
                  <GraduationCap className="text-[#C9A227] mb-2 relative z-10" size={26} />
                  <h3 className="text-white font-black text-sm leading-snug relative z-10">{f.titre}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-gray-500 text-xs mb-4 flex-1 leading-relaxed">{f.accroche}</p>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">À partir de</p>
                    <p className="text-[#C9A227] font-black text-xl mb-3">{f.tarifs?.[0]?.prix || '—'}</p>
                    <Link to="/formations"
                      className="w-full bg-[#065280] group-hover:bg-[#0A69AD] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      Voir le programme <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TÉMOIGNAGES PREMIUM ============ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#065280]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.08)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(10,105,173,0.2)_0%,_transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Ce qu'ils disent</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Ils nous font confiance</h2>
          </motion.div>
          <TestimonialsCarousel temoignages={temoignages} />
        </div>
      </section>

      {/* ============ GALERIE ============ */}
      {galerie.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="text-[#C9A227] font-bold text-xs tracking-widest uppercase">Notre cabinet en images</span>
              <h2 className="text-3xl font-black text-[#065280] mt-2">Galerie</h2>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {galerie.slice(0, 8).map((item, i) => (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative group overflow-hidden rounded-2xl aspect-square bg-gray-100 cursor-pointer"
                >
                  <img src={item.url} alt={item.caption || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-[#065280]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <p className="text-white text-xs p-3 font-semibold">{item.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA FINAL PREMIUM ============ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#C9A227]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(6,82,128,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(6,82,128,0.1)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-4xl font-black text-[#065280] mb-4">
              Prêt à faire passer votre gestion<br className="hidden md:block" /> au niveau supérieur ?
            </h2>
            <p className="text-[#065280]/70 mb-8 max-w-xl mx-auto text-sm">
              Contactez-nous pour un accompagnement sur mesure. Premier entretien gratuit et sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#065280] hover:bg-[#0A69AD] text-white font-black px-8 py-4 rounded-xl transition-all shadow-2xl text-sm"
                >
                  Contactez-nous <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link to="/formations"
                  className="inline-flex items-center justify-center gap-2 bg-white/30 hover:bg-white/50 text-[#065280] font-bold px-8 py-4 rounded-xl transition-all text-sm border border-[#065280]/20"
                >
                  Nos formations <GraduationCap size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}