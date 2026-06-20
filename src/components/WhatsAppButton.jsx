import { MessageCircle } from 'lucide-react'
import { cabinetInfo } from '../data/content'

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${cabinetInfo.whatsapp}?text=Bonjour%20BK%20Success%20Consulting%2C%20j%27aimerais%20avoir%20des%20informations.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebe5d] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-110"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle size={28} fill="white" />
    </a>
  )
}