import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Calendar, ArrowRight } from 'lucide-react'
import { store } from '../data/contentStore'
import { cabinetInfo } from '../data/content'

const CATEGORIES = [
  { value: 'all', label: 'Tous les articles' },
  { value: 'fiscalite', label: '📊 Fiscalité' },
  { value: 'comptabilite', label: '📋 Comptabilité OHADA' },
  { value: 'creation-entreprise', label: '🏢 Création d\'entreprise' },
  { value: 'conseils', label: '💡 Conseils & Gestion' },
  { value: 'actualites', label: '📰 Actualités' },
]

export default function Blog() {
  const [articles, setArticles] = useState([])
  const [chargement, setChargement] = useState(true)
  const [categActive, setCategActive] = useState('all')
  const [articleOuvert, setArticleOuvert] = useState(null)

  useEffect(() => {
    let actif = true

    store.getBlogArticles(true).then((data) => {
      if (actif) {
        setArticles(data)
        setChargement(false)
      }
    })

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
                    {/* IMAGE */}
                    {article.image_url ? (
                      <div className="overflow-hidden h-48">
                        <img
                          src={article.image_url}
                          alt={article.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
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
                          onClick={() =>
                            setArticleOuvert(
                              estOuvert ? null : article.id
                            )
                          }
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
    </div>
  )
}