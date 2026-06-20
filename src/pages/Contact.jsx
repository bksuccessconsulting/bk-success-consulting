import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react'
import { cabinetInfo, services } from '../data/content'

export default function Contact() {
  const [form, setForm] = useState({ nom: '', telephone: '', email: '', service: '', message: '' })
  const [envoye, setEnvoye] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const texte = `Bonjour BK Success Consulting,%0A%0ANom : ${form.nom}%0ATéléphone : ${form.telephone}%0AEmail : ${form.email}%0AService concerné : ${form.service}%0A%0AMessage : ${form.message}`
    window.open(`https://wa.me/${cabinetInfo.whatsapp}?text=${texte}`, '_blank')
    setEnvoye(true)
    setForm({ nom: '', telephone: '', email: '', service: '', message: '' })
  }

  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(cabinetInfo.adresse)}&output=embed`

  return (
    <div>
      <section className="bg-gradient-to-br from-[#065280] to-[#0A69AD] py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">Parlons de votre projet</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 mb-4">Contactez-nous</h1>
          <p className="text-gray-200">Une question, un devis, une formation ? Notre équipe vous répond rapidement.</p>
        </div>
      </section>

      <section className="bg-[#F4F6F8] py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-8">

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-[#065280] mb-6">Envoyez-nous un message</h2>

            {envoye && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-5">
                Votre message s'ouvre dans WhatsApp — envoyez-le pour finaliser votre demande !
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="nom" value={form.nom} onChange={handleChange} required placeholder="Votre nom complet"
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0A69AD] w-full" />
                <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} required placeholder="Votre téléphone"
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0A69AD] w-full" />
              </div>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Votre email (optionnel)"
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0A69AD] w-full" />
              <select name="service" value={form.service} onChange={handleChange} required
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0A69AD] w-full text-gray-600">
                <option value="">Service concerné</option>
                {services.map((s) => (<option key={s.id} value={s.titre}>{s.titre}</option>))}
                <option value="Formation">Formation</option>
                <option value="Autre">Autre</option>
              </select>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Votre message"
                className="border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0A69AD] w-full resize-none" />
              <button type="submit" className="w-full bg-[#0A69AD] hover:bg-[#065280] text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Send size={18} /> Envoyer via WhatsApp
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
            <div className="bg-[#065280] rounded-2xl p-6 text-white space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#C9A227] shrink-0 mt-1" size={20} />
                <div><p className="font-semibold">Adresse</p><p className="text-sm text-gray-300">{cabinetInfo.adresse}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-[#C9A227] shrink-0 mt-1" size={20} />
                <div><p className="font-semibold">Téléphone</p><p className="text-sm text-gray-300">{cabinetInfo.telephonePrincipal} / {cabinetInfo.telephoneSecondaire}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-[#C9A227] shrink-0 mt-1" size={20} />
                <div><p className="font-semibold">Email</p><p className="text-sm text-gray-300">{cabinetInfo.email}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-[#C9A227] shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold">Horaires</p>
                  <p className="text-sm text-gray-300">Lun–Ven : {cabinetInfo.horaires.semaine}</p>
                  <p className="text-sm text-gray-300">Samedi : {cabinetInfo.horaires.samedi}</p>
                  <p className="text-sm text-gray-300">Dimanche : {cabinetInfo.horaires.dimanche}</p>
                </div>
              </div>
              <a href={`https://wa.me/${cabinetInfo.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-lg text-sm transition-colors">
                <MessageCircle size={18} /> Discuter sur WhatsApp
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-100 h-64">
              <iframe title="Carte BK Success Consulting" src={mapsUrl} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}