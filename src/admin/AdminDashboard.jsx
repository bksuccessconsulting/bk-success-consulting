import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Megaphone, Image, GraduationCap, Quote, Inbox, LogOut } from 'lucide-react'

const menu = [
  { id: 'accueil', label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: 'annonces', label: 'Annonces & Statuts', icon: Megaphone },
  { id: 'medias', label: 'Médiathèque', icon: Image },
  { id: 'formations', label: 'Formations', icon: GraduationCap },
  { id: 'temoignages', label: 'Témoignages', icon: Quote },
  { id: 'messages', label: 'Messages reçus', icon: Inbox },
]

export default function AdminDashboard() {
  const [actif, setActif] = useState('accueil')

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex">
      <aside className="w-64 bg-[#065280] text-white flex flex-col">
        <div className="p-5 border-b border-white/10">
          <img src="/logo.png" alt="BKSC" className="h-10 bg-white/95 rounded p-1" />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => setActif(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  actif === item.id ? 'bg-[#C9A227] text-[#065280]' : 'text-gray-200 hover:bg-white/10'
                }`}>
                <Icon size={18} /> {item.label}
              </button>
            )
          })}
        </nav>
        <Link to="/" className="flex items-center gap-3 px-4 py-4 border-t border-white/10 text-gray-300 hover:text-white text-sm">
          <LogOut size={18} /> Retour au site
        </Link>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-black text-[#065280] mb-2">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mb-8">Section : {menu.find((m) => m.id === actif)?.label}</p>
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm">
            Cette section sera connectée à Firebase à l'étape suivante pour la gestion complète du contenu en temps réel.
          </p>
        </div>
      </main>
    </div>
  )
}