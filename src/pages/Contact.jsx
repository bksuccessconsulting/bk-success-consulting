import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Phone, Mail, MapPin, Clock, MessageCircle,
  Send, CheckCircle2, User, AtSign, FileText,
} from 'lucide-react'
import { cabinetInfo } from '../data/content'
import Seo from '../components/Seo'

export default function Contact() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [sujet, setSujet] = useState('')
  const [message, setMessage] = useState('')

  // Envoyer via WhatsApp
  const envoyerWhatsApp = (e) => {
    e.preventDefault()
    if (!nom || !message) { alert('Nom et message obligatoires.'); return }
    const texte = `Bonjour BK Success Consulting,\n\nNom : ${nom}\nEmail : ${email || 'Non renseigné'}\nSujet : ${sujet || 'Non renseigné'}\n\nMessage :\n${message}`
    window.open(`https://wa.me/${cabinetInfo.whatsapp}?text=${encodeURIComponent(texte)}`, '_blank')
  }

  // Envoyer via Email
  const envoyerEmail = (e) => {
    e.preventDefault()
    if (!nom || !message) { alert('Nom et message obligatoires.'); return }
    const destinataire = 'contact@bks-conseil.com'
    const sujetMail = sujet || `Message de ${nom} via le site bks-conseil.com`
    const corps = `Bonjour BK Success Consulting,\n\nNom : ${nom}\nEmail de réponse : ${email || 'Non renseigné'}\n\nMessage :\n${message}`
    window.open(`mailto:${destinataire}?subject=${encodeURIComponent(sujetMail)}&body=${encodeURIComponent(corps)}`)
  }

  const infos = [
    {
      icon: Phone,
      titre: 'Téléphone',
      lignes: [cabinetInfo.telephonePrincipal, cabinetInfo.telephoneSecondaire],
      lien: `tel:${cabinetInfo.telephonePrincipal}`,
    },
    {
      icon: Mail,
      titre: 'Email',
      lignes: ['contact@bks-conseil.com', cabinetInfo.email],
      lien: 'mailto:contact@bks-conseil.com',
    },
    {
      icon: MapPin,
      titre: 'Adresse',
      lignes: ['Ndogbong Citadelle', 'Ancien dépôt Guinness, Douala'],
      lien: 'https://maps.google.com/?q=Ndogbong+Douala+Cameroun',
    },
    {
      icon: Clock,
      titre: 'Horaires',
      lignes: ['Lun – Ven : 08h00 – 17h00', 'Samedi : 08h00 – 13h00'],
    },
  ]

  return (
    <div>
      <Seo
        titre="Contactez-nous"
        description="Contactez BK Success Consulting SARL à Douala : téléphone, WhatsApp, email ou formulaire en ligne. Cabinet basé à Ndogbong Citadelle, Douala, Cameroun."
        chemin="/contact"
      />
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#065280] to-[#0A69AD] py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:24px_24px]" />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-[#C9A227] font-bold text-xs tracking-widest uppercase"
          >
            Parlons de votre projet
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-white mt-3 mb-4"
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-200 text-sm"
          >
            Premier entretien gratuit et sans engagement
          </motion.p>
        </div>
      </section>

      {/* CONTENU PRINCIPAL */}
      <section className="bg-[#F4F6F8] py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FORMULAIRE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
          >
            <h2 className="text-xl font-black text-[#065280] mb-2">Envoyez-nous un message</h2>
            <p className="text-gray-400 text-sm mb-6">
              Choisissez votre moyen de contact préféré — WhatsApp ou Email.
            </p>

            <div className="space-y-4">
              {/* Nom */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">
                  Votre nom *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    placeholder="Ex: Jean Dupont"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#0A69AD] focus:ring-2 focus:ring-[#0A69AD]/10 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Email de réponse */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">
                  Votre email (pour qu'on vous réponde)
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#0A69AD] focus:ring-2 focus:ring-[#0A69AD]/10 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Sujet */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">
                  Sujet
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <select
                    value={sujet}
                    onChange={e => setSujet(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#0A69AD] bg-white appearance-none"
                  >
                    <option value="">Choisir un sujet...</option>
                    <option value="Demande de devis comptable">Demande de devis comptable</option>
                    <option value="Inscription formation">Inscription formation</option>
                    <option value="Question fiscale">Question fiscale (TVA, IS, DSF...)</option>
                    <option value="Création d'entreprise">Création d'entreprise</option>
                    <option value="Audit et conseil">Audit et conseil</option>
                    <option value="Autre demande">Autre demande</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1.5">
                  Votre message *
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Décrivez votre besoin en quelques mots..."
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A69AD] focus:ring-2 focus:ring-[#0A69AD]/10 transition-all bg-white resize-none"
                />
              </div>

              {/* 2 BOUTONS D'ENVOI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={envoyerWhatsApp}
                  disabled={!nom || !message}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-all text-sm shadow-lg hover:scale-105 disabled:hover:scale-100"
                >
                  <MessageCircle size={18} />
                  Envoyer sur WhatsApp
                </button>

                <button
                  onClick={envoyerEmail}
                  disabled={!nom || !message}
                  className="flex items-center justify-center gap-2 bg-[#065280] hover:bg-[#0A69AD] disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-all text-sm shadow-lg hover:scale-105 disabled:hover:scale-100"
                >
                  <Send size={18} />
                  Envoyer par Email
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center">
                * Champs obligatoires · Vos données restent confidentielles
              </p>
            </div>
          </motion.div>

          {/* INFOS CONTACT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Carte d'infos */}
            {infos.map((info, i) => {
              const Icon = info.icon
              return (
                <motion.div
                  key={info.titre}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4 hover:border-[#0A69AD]/30 transition-colors"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-[#0A69AD] to-[#065280] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Icon className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-black text-[#065280] text-sm mb-1">{info.titre}</p>
                    {info.lignes.map((ligne, j) => (
                      info.lien ? (
                        <a key={j} href={info.lien} target="_blank" rel="noopener noreferrer"
                          className="block text-gray-500 text-sm hover:text-[#0A69AD] transition-colors">
                          {ligne}
                        </a>
                      ) : (
                        <p key={j} className="text-gray-500 text-sm">{ligne}</p>
                      )
                    ))}
                  </div>
                </motion.div>
              )
            })}

            {/* Bouton WhatsApp direct */}
            <motion.a
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              href={`https://wa.me/${cabinetInfo.whatsapp}?text=${encodeURIComponent('Bonjour BK Success Consulting, je souhaite un renseignement.')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black py-4 rounded-2xl transition-all shadow-xl hover:scale-105 text-sm"
            >
              <MessageCircle size={20} />
              Discuter directement sur WhatsApp
            </motion.a>

            {/* Google Maps */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-52"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.7689!2d9.7!3d4.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMDMnMDAuMCJOIDnCsDQyJzAwLjAiRQ!5e0!3m2!1sfr!2scm!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Localisation BK Success Consulting"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}