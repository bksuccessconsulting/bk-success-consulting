import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { cabinetInfo, reseauxSociaux, services } from '../data/content'

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function IconLinkedin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function IconYoutube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#065280] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        <div className="flex flex-col gap-4">
          <Link to="/">
            <img src="/logo.png" alt="BK Success Consulting" className="h-16 w-auto bg-white/95 rounded-lg p-2" />
          </Link>
          <p className="text-sm leading-relaxed text-gray-300">{cabinetInfo.accroche}</p>
          <div className="flex items-center gap-3 mt-2">
            <a href={reseauxSociaux.facebook} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 hover:bg-[#C9A227] hover:text-[#065280] text-white rounded-lg flex items-center justify-center transition-all duration-200">
              <IconFacebook />
            </a>
            <a href={reseauxSociaux.linkedin} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 hover:bg-[#C9A227] hover:text-[#065280] text-white rounded-lg flex items-center justify-center transition-all duration-200">
              <IconLinkedin />
            </a>
            <a href={reseauxSociaux.instagram} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 hover:bg-[#C9A227] hover:text-[#065280] text-white rounded-lg flex items-center justify-center transition-all duration-200">
              <IconInstagram />
            </a>
            <a href={reseauxSociaux.youtube} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 bg-white/10 hover:bg-[#C9A227] hover:text-[#065280] text-white rounded-lg flex items-center justify-center transition-all duration-200">
              <IconYoutube />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg border-b border-[#C9A227] pb-2">Liens rapides</h3>
          <div className="flex flex-col gap-2">
            {[
              { nom: 'Accueil', chemin: '/' },
              { nom: 'À propos', chemin: '/about' },
              { nom: 'Services', chemin: '/services' },
              { nom: 'Formations', chemin: '/formations' },
              { nom: 'Contact', chemin: '/contact' },
            ].map((lien) => (
              <Link key={lien.chemin} to={lien.chemin}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#C9A227] transition-colors duration-200">
                <ArrowRight size={14} />
                {lien.nom}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg border-b border-[#C9A227] pb-2">Nos services</h3>
          <div className="flex flex-col gap-2">
            {services.map((service) => (
              <Link key={service.id} to="/services"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#C9A227] transition-colors duration-200">
                <ArrowRight size={14} className="text-[#C9A227]" />
                {service.titre}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white font-bold text-lg border-b border-[#C9A227] pb-2">Contact</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#C9A227] mt-0.5 shrink-0" />
              <span className="text-sm text-gray-300">{cabinetInfo.adresse}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-[#C9A227] shrink-0" />
              <span className="text-sm text-gray-300">{cabinetInfo.telephonePrincipal}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#C9A227] shrink-0" />
              <span className="text-sm text-gray-300">{cabinetInfo.email}</span>
            </div>
          </div>
          <a href={reseauxSociaux.whatsapp} target="_blank" rel="noopener noreferrer"
            className="mt-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
            Écrire sur WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <span>© {new Date().getFullYear()} {cabinetInfo.nomComplet}. Tous droits réservés.</span>
          <span>RCCM : {cabinetInfo.rccm} | NIU : {cabinetInfo.niu}</span>
        </div>
      </div>
    </footer>
  )
}