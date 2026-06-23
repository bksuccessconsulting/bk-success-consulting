import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, GraduationCap, Users, Quote, Image,
  Megaphone, Inbox, LogOut, Plus, Pencil, Trash2,
} from 'lucide-react'
import { store } from '../data/contentStore'

const menu = [
  { id: 'accueil', label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'formations', label: 'Formations', icon: GraduationCap },
  { id: 'equipe', label: 'Équipe', icon: Users },
  { id: 'temoignages', label: 'Témoignages', icon: Quote },
  { id: 'medias', label: 'Médias', icon: Image },
  { id: 'annonces', label: 'Annonces & Statuts', icon: Megaphone },
  { id: 'messages', label: 'Messages reçus', icon: Inbox },
]

function SectionListe({ titre, champs, getter, setter }) {
  const [items, setItems] = useState([])
  const [chargement, setChargement] = useState(true)
  const [edition, setEdition] = useState(null)
  const vide = Object.fromEntries(champs.map((c) => [c.cle, '']))
  const [brouillon, setBrouillon] = useState(vide)

  useEffect(() => {
    let actif = true
    getter().then((data) => { if (actif) { setItems(data); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const versBrouillon = (item) => {
    const b = {}
    champs.forEach((c) => { b[c.cle] = c.isArray ? (item[c.cle] || []).join('\n') : (item[c.cle] ?? '') })
    return b
  }
  const versItem = (b, ancien = {}) => {
    const obj = { ...ancien }
    champs.forEach((c) => {
      obj[c.cle] = c.isArray ? b[c.cle].split('\n').map((s) => s.trim()).filter(Boolean) : b[c.cle]
    })
    return obj
  }

  const demarrerEdition = (item, i) => { setBrouillon(versBrouillon(item)); setEdition(i) }
  const demarrerAjout = () => { setBrouillon(vide); setEdition('nouveau') }
  const annuler = () => { setEdition(null); setBrouillon(vide) }

  const sauvegarder = async () => {
    let nouveaux
    if (edition === 'nouveau') nouveaux = [...items, versItem(brouillon, { id: Date.now() })]
    else nouveaux = items.map((it, i) => (i === edition ? versItem(brouillon, it) : it))
    setItems(nouveaux)
    await setter(nouveaux)
    annuler()
  }
  const supprimer = async (i) => {
    if (!confirm('Supprimer cet élément ?')) return
    const nouveaux = items.filter((_, idx) => idx !== i)
    setItems(nouveaux)
    await setter(nouveaux)
  }

  if (chargement) return <p className="text-gray-400 text-sm">Chargement…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#065280]">{titre}</h2>
        <button onClick={demarrerAjout} className="bg-[#0A69AD] text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {edition !== null && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-xl p-5 mb-5 space-y-3">
          {champs.map((c) => (
            <div key={c.cle}>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{c.label}</label>
              {c.type === 'textarea' ? (
                <textarea rows={4} value={brouillon[c.cle] || ''}
                  onChange={(e) => setBrouillon({ ...brouillon, [c.cle]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
              ) : (
                <input value={brouillon[c.cle] || ''}
                  onChange={(e) => setBrouillon({ ...brouillon, [c.cle]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={sauvegarder} className="bg-[#C9A227] text-[#065280] font-bold px-4 py-2 rounded-lg text-sm">Enregistrer</button>
            <button onClick={annuler} className="text-gray-500 px-4 py-2 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between gap-3">
            <div className="text-sm min-w-0">
              <p className="font-semibold text-[#065280] truncate">{item[champs[0].cle]}</p>
              {champs[1] && <p className="text-gray-500 text-xs truncate">{String(item[champs[1].cle] || '').slice(0, 90)}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => demarrerEdition(item, i)} className="text-[#0A69AD] p-2 hover:bg-[#F4F6F8] rounded-lg"><Pencil size={16} /></button>
              <button onClick={() => supprimer(i)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400 text-sm text-center py-6">Aucun élément pour le moment.</p>}
      </div>
    </div>
  )
}

function SectionFormations() {
  const [items, setItems] = useState([])
  const [chargement, setChargement] = useState(true)
  const [edition, setEdition] = useState(null)
  const videBrouillon = { titre: '', accroche: '', places: '', prochainesSessions: '', publicVise: '', tarifEtudiant: '', tarifSalarie: '', tarifChef: '' }
  const [brouillon, setBrouillon] = useState(videBrouillon)

  useEffect(() => {
    let actif = true
    store.getFormations().then((data) => { if (actif) { setItems(data); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const versBrouillon = (f) => ({
    titre: f.titre || '', accroche: f.accroche || '', places: f.places || '',
    prochainesSessions: (f.prochainesSessions || []).join('\n'),
    publicVise: f.publicVise || '',
    tarifEtudiant: f.tarifs?.[0]?.prix || '',
    tarifSalarie: f.tarifs?.[1]?.prix || '',
    tarifChef: f.tarifs?.[2]?.prix || '',
  })

  const versFormation = (b, ancien = {}) => ({
    duree: '3 mois (12 semaines) — 240 heures',
    vagueMatin: '08h00 – 12h00', vagueApresMidi: '13h00 – 17h00',
    attestation: 'Attestation BKSC avec mention (note /20)',
    paiement: '3 tranches mensuelles accessibles',
    fraisInscription: '10 000 FCFA (non remboursables)',
    minimumApprenants: 6, programme: [],
    ...ancien,
    titre: b.titre, accroche: b.accroche, places: b.places,
    prochainesSessions: b.prochainesSessions.split('\n').map((s) => s.trim()).filter(Boolean),
    publicVise: b.publicVise,
    tarifs: [
      { segment: "Étudiant(e)s", prix: b.tarifEtudiant },
      { segment: "Salarié(e)s", prix: b.tarifSalarie },
      { segment: "Chef(fe)s d'entreprise", prix: b.tarifChef },
    ],
  })

  const demarrerEdition = (item, i) => { setBrouillon(versBrouillon(item)); setEdition(i) }
  const demarrerAjout = () => { setBrouillon(videBrouillon); setEdition('nouveau') }
  const annuler = () => { setEdition(null); setBrouillon(videBrouillon) }

  const sauvegarder = async () => {
    let nouveaux
    if (edition === 'nouveau') nouveaux = [...items, versFormation(brouillon, { id: Date.now() })]
    else nouveaux = items.map((it, i) => (i === edition ? versFormation(brouillon, it) : it))
    setItems(nouveaux)
    await store.setFormations(nouveaux)
    annuler()
  }
  const supprimer = async (i) => {
    if (!confirm('Supprimer cette formation ?')) return
    const nouveaux = items.filter((_, idx) => idx !== i)
    setItems(nouveaux)
    await store.setFormations(nouveaux)
  }

  const champTexte = (cle, label) => (
    <div key={cle}>
      <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
      <input value={brouillon[cle]} onChange={(e) => setBrouillon({ ...brouillon, [cle]: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
    </div>
  )

  if (chargement) return <p className="text-gray-400 text-sm">Chargement…</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#065280]">Formations</h2>
        <button onClick={demarrerAjout} className="bg-[#0A69AD] text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {edition !== null && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-xl p-5 mb-5 space-y-3">
          {champTexte('titre', 'Titre de la formation')}
          {champTexte('accroche', 'Accroche courte')}
          {champTexte('places', 'Places disponibles')}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Prochaines sessions (une par ligne)</label>
            <textarea rows={2} value={brouillon.prochainesSessions}
              onChange={(e) => setBrouillon({ ...brouillon, prochainesSessions: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
          </div>
          {champTexte('publicVise', 'Public visé')}
          <div className="grid grid-cols-3 gap-3">
            {champTexte('tarifEtudiant', 'Tarif Étudiants')}
            {champTexte('tarifSalarie', 'Tarif Salariés')}
            {champTexte('tarifChef', "Tarif Chefs d'entreprise")}
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={sauvegarder} className="bg-[#C9A227] text-[#065280] font-bold px-4 py-2 rounded-lg text-sm">Enregistrer</button>
            <button onClick={annuler} className="text-gray-500 px-4 py-2 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between gap-3">
            <div className="text-sm min-w-0">
              <p className="font-semibold text-[#065280] truncate">{item.titre}</p>
              <p className="text-gray-500 text-xs truncate">{item.accroche}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => demarrerEdition(item, i)} className="text-[#0A69AD] p-2 hover:bg-[#F4F6F8] rounded-lg"><Pencil size={16} /></button>
              <button onClick={() => supprimer(i)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionMedias() {
  const [media, setMedia] = useState({ heroVideoUrl: '' })
  const [chargement, setChargement] = useState(true)
  const [enregistre, setEnregistre] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progression, setProgression] = useState(0)

  useEffect(() => {
    let actif = true
    store.getMedia().then((data) => {
      if (actif) { setMedia(data); setChargement(false) }
    })
    return () => { actif = false }
  }, [])

  const handleFichier = async (e) => {
    const fichier = e.target.files[0]
    if (!fichier) return
    setUploading(true)
    setProgression(0)

    const formData = new FormData()
    formData.append('file', fichier)
    formData.append('upload_preset', 'bksc_upload')
    formData.append('cloud_name', 'dsz0yes5j')

    const xhr = new XMLHttpRequest()
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgression(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = async () => {
      const data = JSON.parse(xhr.responseText)
      if (data.secure_url) {
        const nouveauMedia = { ...media, heroVideoUrl: data.secure_url }
        setMedia(nouveauMedia)
        await store.setMedia(nouveauMedia)
        setEnregistre(true)
        // Recharge la page d'accueil automatiquement après 2 secondes
setTimeout(() => {
  window.location.href = '/'
}, 2000)
        setTimeout(() => setEnregistre(false), 3000)
      } else {
        alert('Erreur upload. Vérifie le preset Cloudinary.')
      }
      setUploading(false)
      setProgression(0)
    }
    xhr.onerror = () => { alert("Erreur réseau."); setUploading(false) }
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dsz0yes5j/video/upload')
    xhr.send(formData)
  }

  const sauvegarderLien = async () => {
    await store.setMedia(media)
    setEnregistre(true)
    setTimeout(() => setEnregistre(false), 2000)
  }

  const supprimerVideo = async () => {
    if (!confirm('Supprimer la vidéo Hero ?')) return
    const nouveauMedia = { ...media, heroVideoUrl: '' }
    setMedia(nouveauMedia)
    await store.setMedia(nouveauMedia)
  }

  if (chargement) return <p className="text-gray-400 text-sm">Chargement…</p>

  return (
    <div>
      <h2 className="text-lg font-bold text-[#065280] mb-5">Vidéo Hero (accueil)</h2>
      <div className="bg-[#F4F6F8] border border-gray-200 rounded-xl p-6 space-y-6 max-w-xl">

        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-3">📁 Uploader depuis ton appareil</p>
          <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            uploading ? 'border-[#0A69AD] bg-blue-50' : 'border-gray-300 bg-white hover:border-[#0A69AD] hover:bg-blue-50'
          }`}>
            <input type="file" accept="video/*" onChange={handleFichier} disabled={uploading} className="hidden" />
            {uploading ? (
              <div className="text-center px-6 w-full">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div className="bg-[#0A69AD] h-3 rounded-full transition-all duration-300" style={{ width: `${progression}%` }} />
                </div>
                <p className="text-[#0A69AD] font-semibold text-sm">Upload en cours… {progression}%</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-4xl mb-2">🎬</p>
                <p className="text-sm font-semibold text-[#065280]">Clique pour choisir une vidéo</p>
                <p className="text-xs text-gray-400 mt-1">MP4, MOV, AVI — max 100MB</p>
              </div>
            )}
          </label>
        </div>

        {media.heroVideoUrl && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">✅ Vidéo actuelle</p>
            <video src={media.heroVideoUrl} controls className="w-full rounded-lg border border-gray-200 max-h-40 object-cover" />
            <button onClick={supprimerVideo} className="mt-2 text-red-500 text-xs font-semibold hover:underline">
              🗑 Supprimer la vidéo
            </button>
          </div>
        )}

        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">🔗 Ou coller un lien direct (.mp4)</p>
          <div className="flex gap-2">
            <input value={media.heroVideoUrl} onChange={(e) => setMedia({ ...media, heroVideoUrl: e.target.value })}
              placeholder="https://..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            <button onClick={sauvegarderLien} className="bg-[#C9A227] text-[#065280] font-bold px-4 py-2 rounded-lg text-sm shrink-0">
              {enregistre ? '✓ OK' : 'Sauver'}
            </button>
          </div>
        </div>

        {enregistre && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2">
            ✅ Vidéo enregistrée avec succès !
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [actif, setActif] = useState('accueil')
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.getItem('bksc_admin_auth') !== 'true') navigate('/admin')
  }, [navigate])

  const deconnexion = () => {
    sessionStorage.removeItem('bksc_admin_auth')
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex">
      <aside className="w-64 bg-[#065280] text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <img src="/logo.png" alt="BKSC" className="h-10 bg-white/95 rounded p-1" />
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
        <button onClick={deconnexion} className="flex items-center gap-3 px-4 py-4 border-t border-white/10 text-gray-300 hover:text-white text-sm">
          <LogOut size={18} /> Déconnexion
        </button>
        <Link to="/" className="px-4 pb-4 text-gray-400 hover:text-white text-xs">← Voir le site</Link>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {actif === 'accueil' && (
          <div>
            <h1 className="text-2xl font-black text-[#065280] mb-2">Tableau de bord</h1>
            <p className="text-gray-500 text-sm mb-6">Bienvenue dans l'espace d'administration BK Success Consulting.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Services', icon: '⚙️', id: 'services' },
                { label: 'Formations', icon: '🎓', id: 'formations' },
                { label: 'Équipe', icon: '👥', id: 'equipe' },
                { label: 'Témoignages', icon: '💬', id: 'temoignages' },
              ].map((c) => (
                <button key={c.id} onClick={() => setActif(c.id)}
                  className="bg-white border border-gray-100 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
                  <p className="text-3xl mb-2">{c.icon}</p>
                  <p className="text-sm font-semibold text-[#065280]">{c.label}</p>
                </button>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4">
              ⚠️ Les modifications sont enregistrées sur cet appareil uniquement. Connecte Supabase pour les rendre visibles à tous les visiteurs.
            </div>
          </div>
        )}
        {actif === 'services' && (
          <SectionListe titre="Services" getter={store.getServices} setter={store.setServices}
            champs={[
              { cle: 'titre', label: 'Titre du service' },
              { cle: 'accroche', label: 'Accroche courte' },
              { cle: 'items', label: 'Prestations (une par ligne)', type: 'textarea', isArray: true },
            ]} />
        )}
        {actif === 'formations' && <SectionFormations />}
        {actif === 'equipe' && (
          <SectionListe titre="Équipe" getter={store.getEquipe} setter={store.setEquipe}
            champs={[
              { cle: 'nom', label: 'Nom complet' },
              { cle: 'role', label: 'Fonction' },
              { cle: 'photo', label: 'URL de la photo' },
            ]} />
        )}
        {actif === 'temoignages' && (
          <SectionListe titre="Témoignages" getter={store.getTemoignages} setter={store.setTemoignages}
            champs={[
              { cle: 'nom', label: 'Nom du client' },
              { cle: 'entreprise', label: 'Entreprise' },
              { cle: 'texte', label: 'Témoignage', type: 'textarea' },
            ]} />
        )}
        {actif === 'medias' && <SectionMedias />}
        {(actif === 'annonces' || actif === 'messages') && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-4xl mb-4">{actif === 'annonces' ? '📢' : '📥'}</p>
            <p className="text-gray-400 text-sm">Cette section arrive à la prochaine étape.</p>
          </div>
        )}
      </main>
    </div>
  )
}