import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Settings, X, Check } from 'lucide-react'

const CLE_STOCKAGE = 'bksc_cookie_consent'

// Lit le consentement déjà enregistré (ou null si jamais demandé)
export function lireConsentement() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE)
    return brut ? JSON.parse(brut) : null
  } catch {
    return null
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [personnaliser, setPersonnaliser] = useState(false)
  const [additionnels, setAdditionnels] = useState(true)

  useEffect(() => {
    const consentement = lireConsentement()
    if (!consentement) setVisible(true)
  }, [])

  const enregistrer = (accepteAdditionnels) => {
    const consentement = {
      necessaires: true, // toujours actifs, non désactivables
      additionnels: accepteAdditionnels,
      date: new Date().toISOString(),
    }
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(consentement))
    // Prévient le reste du site (ex: scripts analytics) que le choix a changé
    window.dispatchEvent(new CustomEvent('bksc-cookie-consent', { detail: consentement }))
    setVisible(false)
    setPersonnaliser(false)
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 22 }}
        className="fixed bottom-0 left-0 right-0 z-[90] p-4"
      >
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {!personnaliser ? (
            <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#065280]/10 flex items-center justify-center flex-shrink-0">
                <Cookie size={20} className="text-[#065280]" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">
                Nous utilisons des cookies strictement nécessaires au bon fonctionnement du site,
                ainsi que des cookies additionnels pour améliorer et personnaliser votre expérience.
                Vous pouvez choisir ce que vous acceptez.
              </p>
              <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setPersonnaliser(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Settings size={14} /> Personnaliser
                </button>
                <button
                  onClick={() => enregistrer(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Refuser
                </button>
                <button
                  onClick={() => enregistrer(true)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black text-[#065280] bg-[#C9A227] hover:bg-[#b8932a] transition-colors"
                >
                  Tout accepter
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-[#065280] text-sm">Personnaliser les cookies</h3>
                <button onClick={() => setPersonnaliser(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Cookies strictement nécessaires</p>
                    <p className="text-xs text-gray-500 mt-0.5">Indispensables au fonctionnement du site (navigation, sécurité). Toujours actifs.</p>
                  </div>
                  <div className="w-11 h-6 rounded-full bg-[#065280] flex items-center px-0.5 flex-shrink-0 ml-3">
                    <div className="w-5 h-5 rounded-full bg-white ml-auto flex items-center justify-center">
                      <Check size={12} className="text-[#065280]" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Cookies additionnels</p>
                    <p className="text-xs text-gray-500 mt-0.5">Pour améliorer et personnaliser votre expérience sur le site.</p>
                  </div>
                  <button
                    onClick={() => setAdditionnels(v => !v)}
                    className={`w-11 h-6 rounded-full flex items-center px-0.5 flex-shrink-0 ml-3 transition-colors ${additionnels ? 'bg-[#065280]' : 'bg-gray-300'}`}
                  >
                    <motion.div layout className={`w-5 h-5 rounded-full bg-white ${additionnels ? 'ml-auto' : ''}`} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => enregistrer(additionnels)}
                className="w-full py-2.5 rounded-xl text-xs font-black text-[#065280] bg-[#C9A227] hover:bg-[#b8932a] transition-colors"
              >
                Enregistrer mes préférences
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
