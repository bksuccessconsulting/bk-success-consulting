import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight, GraduationCap } from 'lucide-react'

import heroVideo from '../assets/hero.mp4' // ⭐ solution stable (recommandé)
import { cabinetInfo } from '../data/content'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#065280]">

      {/* 🎥 VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover z-0 scale-105"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* 🧊 FALLBACK (si vidéo bug) */}
      {!loaded && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#065280] via-[#0A69AD] to-[#065280]" />
      )}

      {/* 🌊 OVERLAY PRO (lisibilité parfaite + vidéo visible) */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#065280]/20 via-transparent to-[#065280]/70" />
      </div>

      {/* ✨ DECORATION GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-[#C9A227]/20 blur-[120px] rounded-full z-[1]" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-[#C9A227]/10 blur-[120px] rounded-full z-[1]" />

      {/* 📦 CONTENT */}
      <div className="relative z-10 text-center max-w-5xl px-4">

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] px-5 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-md"
        >
          Cabinet agréé · Droit OHADA · Depuis {cabinetInfo.anneeFondation}
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
        >
          {cabinetInfo.slogan}
        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10"
        >
          {cabinetInfo.accroche}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/contact"
            className="bg-[#C9A227] hover:bg-[#b8932a] text-[#065280] font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl"
          >
            Demander un devis
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/formations"
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 backdrop-blur-md transition-all hover:scale-105"
          >
            <GraduationCap size={18} />
            S'inscrire en formation
          </Link>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <a
        href="#stats"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 animate-bounce z-10"
      >
        <ChevronDown size={30} />
      </a>
    </section>
  )
}navigation
