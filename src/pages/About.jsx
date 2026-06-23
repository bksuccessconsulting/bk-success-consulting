import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Eye, User } from 'lucide-react'
import { cabinetInfo, visionMission, historique, valeurs } from '../data/content'
import { store } from '../data/contentStore'

export default function About() {
  const [equipe, setEquipe] = useState([])

  useEffect(() => {
    let actif = true
    store.getEquipe().then((data) => { if (actif) setEquipe(data) })
    return () => { actif = false }
  }, [])

  const equipeDisponible = equipe.some((m) => !m.nom.startsWith('['))

  return (
    <div>
      <section className="bg-gradient-to-br from-[#065280] to-[#0A69AD] py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">Qui sommes-nous</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 mb-4">À propos de {cabinetInfo.nomComplet}</h1>
          <p className="text-gray-200">{cabinetInfo.accroche}</p>
        </div>
      </section>

      <section className="bg-[#F4F6F8] py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#0A69AD] rounded-xl flex items-center justify-center mb-4">
              <Eye className="text-white" size={22} />
            </div>
            <h2 className="text-xl font-bold text-[#065280] mb-3">Notre Vision</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{visionMission.vision}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-[#C9A227] rounded-xl flex items-center justify-center mb-4">
              <Target className="text-[#065280]" size={22} />
            </div>
            <h2 className="text-xl font-bold text-[#065280] mb-3">Notre Mission</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{visionMission.mission}</p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">Notre parcours</span>
            <h2 className="text-3xl font-black text-[#065280] mt-2">Notre Histoire</h2>
          </div>
          <div className="space-y-6">
            {historique.map((etape, i) => (
              <motion.div key={etape.periode} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-5 items-start">
                <div className="bg-[#0A69AD] text-white font-black text-sm px-4 py-2 rounded-lg shrink-0 min-w-[110px] text-center">{etape.periode}</div>
                <p className="text-gray-600 text-sm leading-relaxed pt-1.5">{etape.texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A69AD] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">Ce qui nous guide</span>
            <h2 className="text-3xl font-black text-white mt-2">Nos Valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {valeurs.map((valeur) => (
              <div key={valeur.titre} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <h4 className="text-[#C9A227] font-bold mb-2">{valeur.titre}</h4>
                <p className="text-gray-200 text-xs leading-relaxed">{valeur.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4F6F8] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">L'équipe</span>
            <h2 className="text-3xl font-black text-[#065280] mt-2">Notre Équipe</h2>
          </div>

          {equipeDisponible ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipe.map((membre, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                  <div className="w-20 h-20 rounded-full bg-[#0A69AD] mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {membre.photo ? (
                      <img src={membre.photo} alt={membre.nom} className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-white" size={32} />
                    )}
                  </div>
                  <h4 className="font-bold text-[#065280]">{membre.nom}</h4>
                  <p className="text-sm text-gray-500">{membre.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-lg mx-auto text-center">
              <User className="text-[#C9A227] mx-auto mb-4" size={36} />
              <p className="text-gray-500 text-sm">Les portraits et présentations de notre équipe seront publiés très prochainement.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}