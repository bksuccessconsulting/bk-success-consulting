import { useState, useEffect, useRef } from 'react'
import { Bell, X, Megaphone } from 'lucide-react'
import { store } from '../data/contentStore'

export default function AnnoncesBanner() {
  const [bandeaux, setBandeaux] = useState([])
  const [alertes, setAlertes] = useState([])
  const [popup, setPopup] = useState(null)
  const [popupOuvert, setPopupOuvert] = useState(false)
  const [ferme, setFerme] = useState(false)

  useEffect(() => {
    store.getAnnoncesActives().then((data) => {
      setBandeaux(data.filter(a => a.type === 'bandeau' || a.type === 'statut'))
      setAlertes(data.filter(a => a.type === 'alerte'))
      const popups = data.filter(a => a.type === 'popup')
      if (popups.length > 0 && !sessionStorage.getItem('bksc_popup_seen')) {
        setPopup(popups[0])
        setPopupOuvert(true)
        sessionStorage.setItem('bksc_popup_seen', '1')
      }
    })
  }, [])

  // Construire le texte qui défile
  const texteDefilant = bandeaux.map(b =>
    b.contenu ? `${b.titre} — ${b.contenu}` : b.titre
  ).join('     •     ')

  if (bandeaux.length === 0 && alertes.length === 0 && !popupOuvert) return null

  return (
    <>
      {/* ALERTE URGENTE */}
      {alertes[0] && (
        <div className="bg-red-600 text-white py-1.5 px-4 text-center text-xs font-bold">
          <Bell size={11} className="inline mr-1 animate-bounce" />
          {alertes[0].titre}
          {alertes[0].contenu && ` — ${alertes[0].contenu}`}
        </div>
      )}

      {/* BANDEAU DÉFILANT STYLE TV */}
      {bandeaux.length > 0 && !ferme && (
        <div className="bg-[#C9A227] text-[#065280] py-2 flex items-center overflow-hidden relative">
          {/* Icône fixe à gauche */}
          <div className="flex items-center gap-2 px-3 shrink-0 z-10 bg-[#C9A227]">
            <Megaphone size={15} className="shrink-0" />
            <span className="font-black text-xs uppercase tracking-wider whitespace-nowrap">
              Actualités
            </span>
            <div className="w-px h-4 bg-[#065280]/30 mx-1" />
          </div>

          {/* Texte qui défile */}
          <div className="flex-1 overflow-hidden">
            <div
              className="whitespace-nowrap text-sm font-semibold"
              style={{
                display: 'inline-block',
                animation: 'defilement 25s linear infinite',
              }}
            >
              {texteDefilant}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{texteDefilant}
            </div>
          </div>

          {/* Bouton fermer */}
          <button
            onClick={() => setFerme(true)}
            className="shrink-0 px-3 hover:opacity-70 transition-opacity z-10 bg-[#C9A227]"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* CSS pour l'animation */}
      <style>{`
        @keyframes defilement {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* POPUP */}
      {popupOuvert && popup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setPopupOuvert(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {popup.image_url && (
              <img src={popup.image_url} alt="" className="w-full h-44 object-cover" />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-[#065280] text-lg leading-tight pr-2">
                  {popup.titre}
                </h3>
                <button onClick={() => setPopupOuvert(false)} className="text-gray-400 hover:text-gray-600 shrink-0">
                  <X size={20} />
                </button>
              </div>
              {popup.contenu && (
                <p className="text-gray-600 text-sm leading-relaxed">{popup.contenu}</p>
              )}
              <button
                onClick={() => setPopupOuvert(false)}
                className="mt-4 w-full bg-[#0A69AD] text-white font-bold py-2.5 rounded-lg text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}