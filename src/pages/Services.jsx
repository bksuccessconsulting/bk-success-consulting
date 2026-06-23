import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, FileText, Users, Scale, Search, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { store } from '../data/contentStore'

const iconMap = { Calculator, FileText, Users, Scale, Search, Lightbulb }

export default function Services() {
  const [services, setServices] = useState([])

  useEffect(() => {
    let actif = true
    store.getServices().then((data) => { if (actif) setServices(data) })
    return () => { actif = false }
  }, [])

  return (
    <div>
      <section className="bg-gradient-to-br from-[#065280] to-[#0A69AD] py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">Ce que nous faisons</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 mb-4">Nos Services</h1>
          <p className="text-gray-200">Un accompagnement complet : comptabilité, fiscalité, social, juridique, audit et conseil.</p>
        </div>
      </section>

      <section className="bg-[#F4F6F8] py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {services.map((service, i) => {
            const Icon = iconMap[service.icone] || Calculator
            const inverse = i % 2 === 1
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row ${inverse ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/3 bg-[#0A69AD] p-8 flex flex-col justify-center">
                  <div className="w-14 h-14 bg-[#C9A227] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-[#065280]" size={26} />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">{service.titre}</h2>
                  <p className="text-gray-200 text-sm">{service.accroche}</p>
                </div>
                <div className="md:w-2/3 p-8">
                  <ul className="space-y-3">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle2 className="text-[#C9A227] shrink-0 mt-0.5" size={18} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="bg-[#C9A227] py-14 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-black text-[#065280] mb-3">Besoin d'un de ces services ?</h2>
          <p className="text-[#065280]/80 mb-6">Contactez-nous pour un devis personnalisé et gratuit.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#065280] hover:bg-[#054066] text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200">
            Demander un devis <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}