import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { cabinetInfo } from '../data/content'

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const location = useLocation()

  const liens = [
    { nom: 'Accueil', chemin: '/' },
    { nom: 'À propos', chemin: '/about' },
    { nom: 'Services', chemin: '/services' },
    { nom: 'Formations', chemin: '/formations' },
    { nom: 'Contact', chemin: '/contact' },
  ]

  const estActif = (chemin) => location.pathname === chemin

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg">

      {/* Bandeau supérieur */}
      <div className="bg-[#C9A227] text-[#0A69AD] py-1 px-4 text-center text-xs md:text-sm font-semibold">
        📞 {cabinetInfo.telephonePrincipal} | ✉️ {cabinetInfo.email}
      </div>

      {/* Navbar principale */}
      <div className="bg-[#0A69AD] px-4 py-2 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="BK Success Consulting"
              className="h-14 w-auto"
            />
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {liens.map((lien) => (
              <Link
                key={lien.chemin}
                to={lien.chemin}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  estActif(lien.chemin)
                    ? 'bg-[#C9A227] text-[#065280]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {lien.nom}
              </Link>
            ))}
          </div>

          {/* Bouton Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/${cabinetInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9A227] hover:bg-[#b89320] text-[#065280] font-bold px-5 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
            >
              <Phone size={16} />
              Devis gratuit
            </a>
          </div>

          {/* Bouton Mobile */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOuvert(!menuOuvert)}
          >
            {menuOuvert ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Menu Mobile */}
      {menuOuvert && (
        <div className="md:hidden bg-[#065280] border-t border-white/10 px-4 py-4 flex flex-col gap-2">

          {liens.map((lien) => (
            <Link
              key={lien.chemin}
              to={lien.chemin}
              onClick={() => setMenuOuvert(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                estActif(lien.chemin)
                  ? 'bg-[#C9A227] text-[#065280]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {lien.nom}
            </Link>
          ))}

          <a
            href={`https://wa.me/${cabinetInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-[#C9A227] text-[#065280] font-bold px-4 py-3 rounded-lg text-sm text-center"
          >
            Devis gratuit
          </a>

        </div>
      )}
    </nav>
  )
}