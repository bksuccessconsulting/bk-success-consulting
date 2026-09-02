import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Calendar, ArrowRight } from 'lucide-react'
import { store } from '../data/contentStore'
import { cabinetInfo } from '../data/content'
import Lightbox from '../components/Lightbox'

const CATEGORIES = [
  { value: 'all', label: 'Tous les articles' },
  { value: 'fiscalite', label: '📊 Fiscalité' },
  { value: 'comptabilite', label: '📋 Comptabilité OHADA' },
  { value: 'creation-entreprise', label: '🏢 Création d\'entreprise' },
  { value: 'conseils', label: '💡 Conseils & Gestion' },
  { value: 'actualites', label: '📰 Actualités' },
]

// Un commentaire individuel — badge doré "Réponse du cabinet" pour
// distinguer visuellement les réponses de l'équipe des visiteurs.
function CommentaireItem({ c }) {
  const date = new Date(c.created_at)
  const dateFmt = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const heureFmt = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`rounded-xl p-3 text-xs ${c.est_reponse_equipe ? 'bg-[#065280]/5 border border-[#065280]/15' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="font-bold text-gray-700">
          {c.site_web ? (
            <a href={c.site_web} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">{c.nom}</a>
          ) : c.nom}
        </span>
        {c.est_reponse_equipe && (
          <span className="bg-[#C9A227] text-[#065280] text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide">
            Réponse du cabinet
          </span>
        )}
        <span className="text-gray-400">· {dateFmt} à {heureFmt}</span>
      </div>
      <p className="text-gray-600 leading-relaxed">{c.message}</p>
    </div>
  )
}

// Liste des commentaires d'un article + formulaire (nom, email, site web).
// Les commentaires visiteurs passent par une modération admin avant
// d'être publiés ; les réponses de l'équipe sont ajoutées depuis l'admin.
function SectionCommentaires({ articleId, commentaires }) {
  const [form, setForm] = useState({ nom: '', email: '', site_web: '', message: '' })
  const [envoi, setEnvoi] = useState(false)
  const [envoye, setEnvoye] = useState(false)

  const soumettre = async (e) => {
    e.preventDefault()
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) return
    setEnvoi(true)
    const res = await store.addCommentaire({
      article_id: articleId,
      parent_id: null,
      nom: form.nom.trim(),
      email: form.email.trim(),
      site_web: form.site_web.trim() || null,
      message: form.message.trim(),
    })
    setEnvoi(false)
    if (res) {
      setEnvoye(true)
      setForm({ nom: '', email: '', site_web: '', message: '' })
    }
  }

  const principaux = commentaires.filter(c => !c.parent_id)
  const reponsesDe = (id) => commentaires.filter(c => c.parent_id === id)

  return (
    <div className="mt-6 pt-5 border-t border-gray-100">
      <h4 className="font-black text-[#065280] text-sm mb-4">
        Commentaires {commentaires.length > 0 && `(${commentaires.length})`}
      </h4>

      <div className="space-y-4 mb-6">
        {principaux.length === 0 && (
          <p className="text-xs text-gray-400 italic">Soyez le premier à commenter cet article.</p>
        )}
        {principaux.map((c) => (
          <div key={c.id}>
            <CommentaireItem c={c} />
            {reponsesDe(c.id).map((r) => (
              <div key={r.id} className="ml-6 mt-2">
                <CommentaireItem c={r} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {envoye ? (
        <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl p-3">
          Merci ! Votre commentaire a été envoyé et sera visible après validation par le cabinet.
        </div>
      ) : (
        <form onSubmit={soumettre} className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text" placeholder="Nom *" required
              value={form.nom} onChange={(e) => setForm(f => ({ ...f, nom: e.target.value }))}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0A69AD]"
            />
            <input
              type="email" placeholder="Email *" required
              value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0A69AD]"
            />
          </div>
          <input
            type="url" placeholder="Site web (optionnel)"
            value={form.site_web} onChange={(e) => setForm(f => ({ ...f, site_web: e.target.value }))}
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0A69AD]"
          />
          <textarea
            placeholder="Votre commentaire *" required rows={3}
            value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#0A69AD] resize-none"
          />
          <button
            type="submit" disabled={envoi}
            className="bg-[#065280] hover:bg-[#0A69AD] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {envoi ? 'Envoi...' : 'Publier mon commentaire'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function Blog() {
  const [articles, setArticles] = useState([])
  const [chargement, setChargement] = useState(true)
  const [categActive, setCategActive] = useState('all')
  const [articleOuvert, setArticleOuvert] = useState(null)
  const [lightbox, setLightbox] = useState({ images: [], index: null })
  const [commentaires, setCommentaires] = useState({}) // { [articleId]: [...] }

  const chargerCommentaires = async (articleId) => {
    const data = await store.getCommentaires(articleId, true)
    setCommentaires(c => ({ ...c, [articleId]: data }))
  }

  const ouvrirLightbox = (images, index) => setLightbox({ images, index })
  const fermerLightbox = () => setLightbox({ images: [], index: null })
  const naviguerLightbox = (delta) => {
    setLightbox((lb) => ({
      ...lb,
      index: (lb.index + delta + lb.images.length) % lb.images.length,
    }))
  }

  useEffect(() => {
    let actif = true

    store.getBlogArticles(true).then((data) => {
      if (actif) {
        setArticles(data)
        setChargement(false)
      }
    })

    // Nettoyage silencieux des commentaires de plus de 2 ans, en arrière-plan
    store.nettoyerVieuxCommentaires()

    return () => {
      actif = false
    }
  }, [])

  const articlesFiltres =
    categActive === 'all'
      ? articles
      : articles.filter((a) => a.categorie === categActive)

  const getCategoryLabel = (value) =>
    CATEGORIES.find((c) => c.value === value)?.label || '📰 Actualités'

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#065280] to-[#0A69AD] py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:24px_24px]" />

        <div className="relative max-w-3xl mx-auto px-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#C9A227] font-bold text-xs tracking-widest uppercase"
          >
            Conseils & Actualités
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-white mt-3 mb-4"
          >
            Blog Professionnel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-200 text-sm leading-relaxed max-w-xl mx-auto"
          >
            Fiscalité camerounaise · Comptabilité OHADA · Gestion d'entreprise · Création de sociétés
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#C9A227]/70 text-xs mt-3"
          >
            {articles.length} article{articles.length !== 1 ? 's' : ''} publié
            {articles.length !== 1 ? 's' : ''}
          </motion.p>
        </div>
      </section>

      {/* FILTRES */}
      <div className="bg-white border-b border-gray-100 sticky top-[88px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategActive(cat.value)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                categActive === cat.value
                  ? 'bg-[#0A69AD] text-white shadow-md scale-105'
                  : 'bg-[#F4F6F8] text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ARTICLES */}
      <section className="bg-[#F4F6F8] py-12 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4">
          {chargement ? (
            <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
              <div className="w-5 h-5 border-2 border-[#0A69AD] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Chargement des articles…</span>
            </div>
          ) : articlesFiltres.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <p className="text-5xl mb-4">✍️</p>

              <p className="text-gray-600 text-xl font-black">
                Aucun article pour le moment
              </p>

              <p className="text-gray-400 text-sm mt-2">
                Revenez bientôt pour nos conseils professionnels.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlesFiltres.map((article, i) => {
                const estOuvert = articleOuvert === article.id

                // Toutes les images de l'article : couverture + galerie éventuelle
                const toutesLesImages = [
                  article.image_url,
                  ...(Array.isArray(article.images) ? article.images : []),
                ].filter(Boolean)

                const dateFormat = new Date(
                  article.created_at
                ).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })

                return (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
                  >
                    {/* IMAGE — object-contain pour ne jamais couper l'image, quel que soit son format */}
                    {article.image_url ? (
                      <div
                        onClick={() => ouvrirLightbox(toutesLesImages, 0)}
                        className="relative overflow-hidden h-48 bg-[#F4F6F8] cursor-pointer"
                      >
                        <img
                          src={article.image_url}
                          alt={article.titre}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        {toutesLesImages.length > 1 && (
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            +{toutesLesImages.length - 1} photo{toutesLesImages.length > 2 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-2 bg-gradient-to-r from-[#0A69AD] to-[#C9A227]" />
                    )}

                    <div className="p-5 flex-1 flex flex-col">
                      {/* META */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-xs bg-[#F4F6F8] text-[#065280] font-bold px-2.5 py-1 rounded-full">
                          {getCategoryLabel(article.categorie)}
                        </span>

                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={11} />
                          {dateFormat}
                        </span>
                      </div>

                      {/* TITRE */}
                      <h2 className="font-black text-[#065280] text-base leading-snug mb-2 group-hover:text-[#0A69AD] transition-colors">
                        {article.titre}
                      </h2>

                      {/* EXTRAIT */}
                      {article.extrait && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                          {article.extrait}
                        </p>
                      )}

                      {/* BOUTON */}
                      {article.contenu && (
                        <button
                          onClick={() => {
                            const nouvelId = estOuvert ? null : article.id
                            setArticleOuvert(nouvelId)
                            if (nouvelId && !commentaires[nouvelId]) {
                              chargerCommentaires(nouvelId)
                            }
                          }}
                          className="flex items-center justify-between text-[#0A69AD] font-bold text-sm py-3 border-t border-gray-100 hover:text-[#065280] transition-colors mt-auto"
                        >
                          <span>
                            {estOuvert
                              ? 'Réduire l\'article'
                              : 'Lire l\'article complet'}
                          </span>

                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              estOuvert ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* CONTENU */}
                    {estOuvert && article.contenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5"
                      >
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {article.contenu}
                          </p>

                          {toutesLesImages.length > 1 && (
                            <div className="flex gap-2 flex-wrap mt-4">
                              {toutesLesImages.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => ouvrirLightbox(toutesLesImages, idx)}
                                  className="w-16 h-16 rounded-lg overflow-hidden bg-[#F4F6F8] border border-gray-100 hover:border-[#0A69AD] transition-colors"
                                >
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          )}

                          <a
                            href={`https://wa.me/${
                              cabinetInfo.whatsapp
                            }?text=${encodeURIComponent(
                              `Bonjour, j'ai lu votre article "${article.titre}" et j'ai une question.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                          >
                            Poser une question sur WhatsApp

                            <ArrowRight size={13} />
                          </a>

                          <SectionCommentaires
                            articleId={article.id}
                            commentaires={commentaires[article.id] || []}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#065280] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Une question fiscale ou comptable ?
          </h2>

          <p className="text-gray-300 text-sm mb-7 max-w-md mx-auto">
            Nos experts sont disponibles pour vous accompagner personnellement.
          </p>

          <a
            href={`https://wa.me/${
              cabinetInfo.whatsapp
            }?text=${encodeURIComponent(
              "Bonjour, j'ai une question après avoir lu votre blog."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black px-7 py-4 rounded-xl transition-colors shadow-xl hover:scale-105"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
            </svg>

            Discuter avec un expert
          </a>
        </div>
      </section>

      <Lightbox
        images={lightbox.images}
        index={lightbox.index}
        onClose={fermerLightbox}
        onNav={naviguerLightbox}
      />
    </div>
  )
}