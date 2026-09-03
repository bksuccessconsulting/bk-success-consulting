import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr.json'
import en from './locales/en.json'

// Langue mémorisée dans le navigateur du visiteur (comme le choix cookies)
const langueEnregistree = localStorage.getItem('bksc_langue') || 'fr'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: langueEnregistree,
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
  })

// À appeler depuis le sélecteur de langue (Navbar)
export function changerLangue(code) {
  i18n.changeLanguage(code)
  localStorage.setItem('bksc_langue', code)
}

export default i18n
