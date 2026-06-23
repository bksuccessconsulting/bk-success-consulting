import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Calculator, FileText, Users, Scale, Search, Lightbulb,
  ArrowRight, CheckCircle2, GraduationCap, ChevronDown, Quote, Heart,
} from 'lucide-react'
import { cabinetInfo, stats, valeurs } from '../data/content'
import { store } from '../data/contentStore'
import heroVideoLocal from '../assets/hero.mp4'

const iconMap = { Calculator, FileText, Users, Scale, Search, Lightbulb }

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

export default function Home() {
  const [services, setServices] = useState([])
  const [formations, setFormations] = useState([])
  const [temoignages, setTemoignages] = useState([])
  const [heroVideoUrl, setHeroVideoUrl] = useState(heroVideoLocal)

  useEffect(() => {
    let actif = true
    Promise.all([
      store.getServices(),
      store.getFormations(),
      store.getTemoignages(),
      store.getMedia(),
    ]).then(([s, f, t, m]) => {
      if (!actif) return
      setServices(s)
      setFormations(f)
      setTemoignages(t)
      // Si admin a uploadé une vidéo, elle prend la priorité
      if (m?.heroVideoUrl) setHeroVideoUrl(m.heroVideoUrl)
    })
    return () => { actif = false }
  }, [])

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#065280]">

        <video
          autoPlay muted loop playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#065280]/50 via-[#065280]/30 to-[#065280]/70" />
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-[#C9A227]/15 blur-[120px] rounded-full z-[1]" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-[#C9A227]/10 blur-[120px] rounded-full z-[1]" />

        <div className="relative z-10 text-center max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-block bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#C9A227] px-5 py-2 rounded-full text-sm font-semibold mb-6"
          >
            Cabinet agréé · Droit OHADA · Depuis {cabinetInfo.anneeFondation}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            {cabinetInfo.slogan}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
          >
            {cabinetInfo.accroche}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contact"
              className="bg-[#C9A227] hover:bg-[#b8932a] text-[#065280] font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl">
              Demander un devis <ArrowRight size={18} />
            </Link>
            <Link to="/formations"
              className="bg-white/10 hover:bg-white/20 border border-white/40 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105">
              <GraduationCap size={18} /> S'inscrire en formation
            </Link>
          </motion.div>
        </div>

        <a href="#stats" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 animate-bounce z-10">
          <ChevronDown size={30} />
        </a>
      </section>

      {/* ============ STATS ============ */}
      <section id="stats" className="bg-[#065280] py-14">
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
            <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">Nos expertises</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#065280] mt-2">Nos Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icone] || Calculator
              return (
                <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="w-14 h-14 bg-[#0A69AD] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#C9A227] transition-colors duration-300">
                    <Icon className="text-white" size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-[#065280] mb-2">{service.titre}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.accroche}</p>
                  <Link to="/services" className="text-[#0A69AD] font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    En savoir plus <ArrowRight size={14} />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ VALEURS ============ */}
      <section className="bg-[#0A69AD] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">Pourquoi nous choisir</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">Nos Valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {valeurs.map((valeur, i) => (
              <motion.div key={valeur.titre} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="text-center">
                <div className="w-12 h-12 bg-[#C9A227] rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="text-[#065280]" size={22} />
                </div>
                <h4 className="text-white font-bold mb-1">{valeur.titre}</h4>
                <p className="text-gray-200 text-xs leading-relaxed">{valeur.texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FORMATIONS ============ */}
      <section className="bg-[#F4F6F8] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">Pôle Formation</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#065280] mt-2">Nos Formations Certifiantes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formations.map((formation, i) => (
              <motion.div key={formation.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                <div className="bg-[#065280] p-5">
                  <GraduationCap className="text-[#C9A227] mb-2" size={26} />
                  <h3 className="text-white font-bold text-sm leading-snug">{formation.titre}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-gray-600 text-xs mb-4 flex-1">{formation.accroche}</p>
                  <p className="text-[#C9A227] font-black text-lg mb-3">Dès {formation.tarifs?.[0]?.prix || '—'}</p>
                  <Link to="/formations" className="text-[#0A69AD] font-semibold text-sm flex items-center gap-1">
                    Voir le programme <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TÉMOIGNAGES ============ */}
      <section className="bg-[#065280] py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">Ils nous font confiance</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-2 mb-12">Témoignages Clients</h2>
          {temoignages.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-lg mx-auto">
              <Heart className="text-[#C9A227] mx-auto mb-4" size={36} />
              <p className="text-gray-300">Nos témoignages clients seront publiés très prochainement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {temoignages.map((t, i) => (
                <div key={t.id || i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                  <Quote className="text-[#C9A227] mb-3" size={24} />
                  <p className="text-gray-200 text-sm mb-4 leading-relaxed">{t.texte}</p>
                  <p className="text-white font-bold text-sm">{t.nom}</p>
                  <p className="text-gray-400 text-xs">{t.entreprise}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-[#C9A227] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-[#065280] mb-4">
            Prêt à faire passer votre gestion au niveau supérieur ?
          </h2>
          <p className="text-[#065280]/80 mb-8">Contactez-nous dès aujourd'hui pour un accompagnement sur mesure.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#065280] hover:bg-[#054066] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105">
            Contactez-nous <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}