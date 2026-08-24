import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { cabinetInfo, reseauxSociaux as reseauxSociauxDefaut, services } from '../data/content'
import { store } from '../data/contentStore'

// Un lien n'est valide que s'il commence par http:// ou https://
// (évite les placeholders du type "[LIEN PAGE FACEBOOK]" qui renvoient sur le site lui-même)
const lienValide = (url) => typeof url === 'string' && /^https?:\/\//i.test(url)

// Emojis modernes et reconnaissables pour chaque réseau — plus visuels
// qu'une icône contour classique, tout en restant sobres et professionnels.
const RESEAUX_EMOJI = {
  facebook: '📘',
  linkedin: '💼',
  instagram: '📸',
  youtube: '▶️',
}

export default function Footer() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    let actif = true
    store.getSettings().then((data) => { if (actif) setSettings(data) })
    return () => { actif = false }
  }, [])

  // Les vrais liens viennent de Supabase (admin → Paramètres).
  // On retombe sur les valeurs par défaut de content.js seulement si Supabase n'a rien renvoyé.
  const reseaux = {
    facebook: settings?.facebook ?? reseauxSociauxDefaut.facebook,
    linkedin: settings?.linkedin ?? reseauxSociauxDefaut.linkedin,
    instagram: settings?.instagram ?? reseauxSociauxDefaut.instagram,
    youtube: settings?.youtube ?? reseauxSociauxDefaut.youtube,
    whatsapp: settings?.whatsapp ?? reseauxSociauxDefaut.whatsapp,
  }

  return (
    <footer className="bg-[#065280] text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        <div className="flex flex-col gap-4">
          <Link to="/">
            <img src="/logo.png" alt="BK Success Consulting" className="h-16 w-auto bg-white/95 rounded-lg p-2" />
          </Link>
          <p className="text-sm leading-relaxed text-gray-300">{cabinetInfo.accroche}</p>
          <div className="flex items-center gap-3 mt-2">
            {lienValide(reseaux.facebook) && (
              <a href={reseaux.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 bg-white/10 hover:bg-[#C9A227] rounded-lg flex items-center justify-center transition-all duration-200 text-base">
                {RESEAUX_EMOJI.facebook}
              </a>
            )}
            {lienValide(reseaux.linkedin) && (
              <a href={reseaux.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 bg-white/10 hover:bg-[#C9A227] rounded-lg flex items-center justify-center transition-all duration-200 text-base">
                {RESEAUX_EMOJI.linkedin}
              </a>
            )}
            {lienValide(reseaux.instagram) && (
              <a href={reseaux.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 bg-white/10 hover:bg-[#C9A227] rounded-lg flex items-center justify-center transition-all duration-200 text-base">
                {RESEAUX_EMOJI.instagram}
              </a>
            )}
            {lienValide(reseaux.youtube) && (
              <a href={reseaux.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 bg-white/10 hover:bg-[#C9A227] rounded-lg flex items-center justify-center transition-all duration-200 text-base">
                {RESEAUX_EMOJI.youtube}
              </a>
            )}
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
          <a href={reseaux.whatsapp} target="_blank" rel="noopener noreferrer"
            className="mt-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
            💬 Écrire sur WhatsApp
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