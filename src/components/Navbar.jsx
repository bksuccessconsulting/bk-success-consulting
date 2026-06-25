import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cabinetInfo } from '../data/content'

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const liens = [
    { nom: 'Accueil', chemin: '/' },
    { nom: 'À propos', chemin: '/about' },
    { nom: 'Services', chemin: '/services' },
    { nom: 'Formations', chemin: '/formations' },
    { nom: 'Blog', chemin: '/blog' },
    { nom: 'Contact', chemin: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOuvert(false) }, [location])

  const estActif = (chemin) => location.pathname === chemin

  // Sur les pages autres que Home, toujours solid
  const isHome = location.pathname === '/'
  const solid = scrolled || !isHome

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
      initial={false}
    >
      {/* Bandeau supérieur — visible uniquement quand navbar est solide */}
      <AnimatePresence>
        {solid && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-[#C9A227] text-[#065280] py-1 px-4 text-center text-xs font-bold hidden md:block">
              📞 {cabinetInfo.telephonePrincipal} &nbsp;|&nbsp; ✉️ {cabinetInfo.email} &nbsp;|&nbsp; 📍 {cabinetInfo.repere}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar principale */}
      <div className={`transition-all duration-500 ${
        solid
          ? 'bg-[#0A69AD] shadow-2xl py-2'
          : 'bg-transparent py-4'
      }`}
        style={!solid ? {
          background: 'linear-gradient(to bottom, rgba(6,82,128,0.7) 0%, transparent 100%)'
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.img
        src="/logo.png"
        alt="BK Success Consulting"
        className={`w-auto object-contain transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-xl ${
          solid ? 'h-10 p-1' : 'h-12 p-1.5'
       }`}
       whileHover={{ scale: 1.03 }}
     />
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-0.5">
            {liens.map((lien) => (
              <Link
                key={lien.chemin}
                to={lien.chemin}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 group ${
                  estActif(lien.chemin)
                    ? 'text-[#C9A227]'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                {lien.nom}
                {estActif(lien.chemin) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C9A227] group-hover:w-4 transition-all duration-200 rounded-full" />
              </Link>
            ))}
          </div>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <motion.a
              href={`https://wa.me/${cabinetInfo.whatsapp}?text=${encodeURIComponent('Bonjour BK Success Consulting, je souhaite un devis.')}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#C9A227] hover:bg-[#b8932a] text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-lg"
            >
              <Phone size={15} />
              Devis gratuit
            </motion.a>
          </div>

          {/* Burger mobile */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label="Menu"
          >
            {menuOuvert ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOuvert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
          >
            <div className="bg-[#065280] border-t border-white/10 px-4 py-4 flex flex-col gap-1.5 shadow-2xl">
              {liens.map((lien, i) => (
                <motion.div
                  key={lien.chemin}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={lien.chemin}
                    className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      estActif(lien.chemin)
                        ? 'bg-[#C9A227] text-[#065280]'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {lien.nom}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: liens.length * 0.05 }}
                href={`https://wa.me/${cabinetInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 bg-[#C9A227] text-[#065280] font-black px-4 py-3 rounded-xl text-sm text-center shadow-lg"
              >
                Demander un devis gratuit
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}