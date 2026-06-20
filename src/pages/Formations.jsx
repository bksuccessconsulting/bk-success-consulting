import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Clock,
  Users,
  Award,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
} from 'lucide-react'

import { formations, cabinetInfo } from '../data/content'

export default function Formations() {
  const [ouvert, setOuvert] = useState(null)

  const lienInscription = (formation) =>
    `https://wa.me/${cabinetInfo.whatsapp}?text=${encodeURIComponent(
      `Bonjour BK Success Consulting, je souhaite m'inscrire à la formation "${formation.titre}".`
    )}`

  return (
    <div>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#065280] to-[#0A69AD] py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">

          <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">
            Pôle Formation BKSC
          </span>

          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 mb-4">
            Nos Formations Certifiantes
          </h1>

          <p className="text-gray-200">
            On apprend à faire, pas à savoir.
          </p>

        </div>
      </section>

      {/* LISTE FORMATIONS */}
      <section className="bg-[#F4F6F8] py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-6">

          {formations.map((formation, i) => {
            const estOuvert = ouvert === formation.id

            return (
              <motion.div
                key={formation.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >

                {/* HEADER CARD */}
                <div className="bg-[#065280] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 bg-[#C9A227] rounded-xl flex items-center justify-center shrink-0">
                      <GraduationCap
                        className="text-[#065280]"
                        size={24}
                      />
                    </div>

                    <div>
                      <h2 className="text-white font-black text-lg leading-snug">
                        {formation.titre}
                      </h2>

                      <p className="text-gray-300 text-sm">
                        {formation.accroche}
                      </p>
                    </div>

                  </div>

                  {/* BOUTON INSCRIPTION */}
                  <a
                    href={lienInscription(formation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#C9A227] hover:bg-[#b8932a] text-[#065280] font-bold px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 justify-center shrink-0 transition-all duration-200"
                  >
                    <MessageCircle size={16} />
                    S'inscrire
                  </a>

                </div>

                {/* INFOS */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-100">

                  {/* DURÉE */}
                  <div className="flex items-start gap-3">
                    <Clock
                      className="text-[#C9A227] shrink-0"
                      size={20}
                    />

                    <div className="text-sm">
                      <p className="font-semibold text-[#065280]">
                        {formation.duree}
                      </p>

                      <p className="text-gray-500">
                        Matin {formation.vagueMatin} ou Après-midi {formation.vagueApresMidi}
                      </p>
                    </div>
                  </div>

                  {/* PLACES */}
                  <div className="flex items-start gap-3">
                    <Users
                      className="text-[#C9A227] shrink-0"
                      size={20}
                    />

                    <div className="text-sm">
                      <p className="font-semibold text-[#065280]">
                        {formation.places}
                      </p>

                      <p className="text-gray-500">
                        Min. {formation.minimumApprenants} apprenants pour ouverture
                      </p>
                    </div>
                  </div>

                  {/* CERTIFICATION */}
                  <div className="flex items-start gap-3">
                    <Award
                      className="text-[#C9A227] shrink-0"
                      size={20}
                    />

                    <div className="text-sm">
                      <p className="font-semibold text-[#065280]">
                        {formation.attestation}
                      </p>

                      <p className="text-gray-500">
                        {formation.paiement}
                      </p>
                    </div>
                  </div>

                </div>

                {/* DETAILS */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* SESSIONS */}
                  <div>

                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                      Prochaines sessions
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {formation.prochainesSessions?.map((s) => (
                        <span
                          key={s}
                          className="bg-[#F4F6F8] text-[#065280] text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                      Public visé
                    </p>

                    <p className="text-sm text-gray-600">
                      {formation.publicVise}
                    </p>

                  </div>

                  {/* TARIFS */}
                  <div>

                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                      <CreditCard size={14} />
                      Tarifs par segment
                    </p>

                    <div className="space-y-2">

                      {formation.tarifs?.map((t) => (
                        <div
                          key={t.segment}
                          className="flex justify-between text-sm bg-[#F4F6F8] rounded-lg px-3 py-2"
                        >
                          <span className="text-gray-600">
                            {t.segment}
                          </span>

                          <span className="font-bold text-[#0A69AD]">
                            {t.prix}
                          </span>
                        </div>
                      ))}

                      <p className="text-xs text-gray-400 pt-1">
                        + Inscription : {formation.fraisInscription}
                      </p>

                    </div>

                  </div>

                </div>

                {/* BOUTON PROGRAMME */}
                <button
                  onClick={() =>
                    setOuvert(estOuvert ? null : formation.id)
                  }
                  className="w-full flex items-center justify-center gap-2 text-[#0A69AD] font-semibold text-sm py-4 border-t border-gray-100 hover:bg-[#F4F6F8] transition-colors"
                >
                  {estOuvert
                    ? 'Masquer le programme'
                    : 'Voir le programme détaillé'}

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      estOuvert ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* PROGRAMME */}
                {estOuvert && (
                  <div className="p-6 bg-[#F4F6F8] space-y-2">

                    {formation.programme?.map((semaine) => (
                      <div
                        key={semaine}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <CheckCircle2
                          className="text-[#C9A227] shrink-0 mt-0.5"
                          size={16}
                        />

                        {semaine}
                      </div>
                    ))}

                  </div>
                )}

              </motion.div>
            )
          })}

        </div>
      </section>

    </div>
  )
}