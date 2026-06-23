import { useState, useEffect } from 'react'
import { X, Megaphone } from 'lucide-react'
import { store } from '../data/contentStore'

export default function AnnoncesBanner() {
  const [bandeaux, setBandeaux] = useState([])
  const [alertes, setAlertes] = useState([])
  const [popup, setPopup] = useState(null)
  const [indexActif, setIndexActif] = useState(0)
  const [bandeauFerme, setBandeauFerme] = useState(false)
  const [popupOuvert, setPopupOuvert] = useState(false)

  useEffect(() => {
    store.getAnnoncesActives().then((data) => {
      setBandeaux(data.filter(a => a.type === 'bandeau'))
      setAlertes(data.filter(a => a.type === 'alerte'))
      const popups = data.filter(a => a.type === 'popup')
      if (popups.length > 0 && !sessionStorage.getItem('bksc_popup_seen')) {
        setPopup(popups[0])
        setPopupOuvert(true)
        sessionStorage.setItem('bksc_popup_seen', '1')
      }
    })
  }, [])

  useEffect(() => {
    if (bandeaux.length <= 1) return
    const timer = setInterval(() => setIndexActif(i => (i + 1) % bandeaux.length), 4000)
    return () => clearInterval(timer)
  }, [bandeaux])

  return (
    <>
      {/* BANDEAU */}
      {bandeaux.length > 0 && !bandeauFerme && (
        <div className="bg-[#C9A227] text-[#065280] py-2 px-4 flex items-center gap-3">
          <Megaphone size={15} className="shrink-0" />
          <p className="flex-1 text-sm font-semibold text-center truncate">
            {bandeaux[indexActif]?.titre}
            {bandeaux[indexActif]?.contenu && ` — ${bandeaux[indexActif].contenu}`}
          </p>
          <button onClick={() => setBandeauFerme(true)} className="shrink-0 hover:opacity-70 transition-opacity">
            <X size={15} />
          </button>
        </div>
      )}

      {/* ALERTE */}
      {alertes[0] && (
        <div className="bg-red-600 text-white py-1.5 px-4 text-center text-xs font-semibold">
          🔔 {alertes[0].titre}{alertes[0].contenu && ` — ${alertes[0].contenu}`}
        </div>
      )}

      {/* POPUP */}
      {popupOuvert && popup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setPopupOuvert(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {popup.image_url && (
              <img src={popup.image_url} alt="" className="w-full h-44 object-cover" />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-[#065280] text-lg leading-tight pr-2">{popup.titre}</h3>
                <button onClick={() => setPopupOuvert(false)} className="text-gray-400 hover:text-gray-600 shrink-0">
                  <X size={20} />
                </button>
              </div>
              {popup.contenu && <p className="text-gray-600 text-sm leading-relaxed">{popup.contenu}</p>}
              <button onClick={() => setPopupOuvert(false)}
                className="mt-4 w-full bg-[#0A69AD] hover:bg-[#065280] text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}