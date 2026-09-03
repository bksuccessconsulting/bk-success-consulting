import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://bks-conseil.com'
const SITE_NAME = 'BK Success Consulting'
const IMAGE_DEFAUT = `${SITE_URL}/logo.png`

// Composant SEO réutilisable : à placer en haut de chaque page pour lui
// donner son propre titre, sa propre description et son propre aperçu
// de partage (Open Graph / Twitter), au lieu que toutes les pages du
// site partagent le même titre générique.
export default function Seo({ titre, description, chemin = '', image }) {
  const titreComplet = `${titre} | ${SITE_NAME}`
  const url = `${SITE_URL}${chemin}`
  const imageOg = image || IMAGE_DEFAUT

  return (
    <Helmet>
      <title>{titreComplet}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={titreComplet} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageOg} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={titreComplet} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageOg} />
    </Helmet>
  )
}
