import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, GraduationCap, Users, Quote, Image,
  Megaphone, Inbox, LogOut, Plus, Pencil, Trash2, Menu, X, User,
  Settings, Camera, CheckCircle2, TrendingUp, Star, FileText,
} from 'lucide-react'
import { store } from '../data/contentStore'
import { clearAdminSession } from './AdminGuard'
import { cabinetInfo } from '../data/content'

// ============================================
// HELPER CLOUDINARY
// ============================================
async function uploadCloudinary(fichier, type = 'image', onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', fichier)
    formData.append('upload_preset', 'bksc_upload')
    const xhr = new XMLHttpRequest()
    if (onProgress) xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        if (data.secure_url) resolve(data.secure_url)
        else reject(new Error(data.error?.message || 'Upload échoué'))
      } catch { reject(new Error('Réponse invalide')) }
    }
    xhr.onerror = () => reject(new Error('Erreur réseau'))
    xhr.open('POST', `https://api.cloudinary.com/v1_1/dsz0yes5j/${type}/upload`)
    xhr.send(formData)
  })
}

// ============================================
// MENU
// ============================================
const menu = [
  { id: 'accueil', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'annonces', label: 'Annonces & Statuts', icon: Megaphone },
  { id: 'blog', label: 'Blog & Actualités', icon: FileText },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'formations', label: 'Formations', icon: GraduationCap },
  { id: 'equipe', label: 'Équipe & Photos', icon: Users },
  { id: 'temoignages', label: 'Témoignages', icon: Quote },
  { id: 'galerie', label: 'Galerie Photos', icon: Camera },
  { id: 'galerie_videos', label: 'Vidéos Cabinet', icon: Image },
  { id: 'quiz_admin', label: 'Quiz Questions', icon: Star },
  { id: 'medias', label: 'Vidéo Hero', icon: Image },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
  { id: 'messages', label: 'Messages', icon: Inbox },
]

// ============================================
// SECTION LISTE GÉNÉRIQUE
// ============================================
function SectionListe({ titre, description, champs, getter, setter }) {
  const [items, setItems] = useState([])
  const [chargement, setChargement] = useState(true)
  const [edition, setEdition] = useState(null)
  const vide = Object.fromEntries(champs.map((c) => [c.cle, '']))
  const [brouillon, setBrouillon] = useState(vide)
  const [sauvegarde, setSauvegarde] = useState(false)

  useEffect(() => {
    let actif = true
    getter().then((data) => { if (actif) { setItems(data || []); setChargement(false) } })
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

  const sauvegarder = async () => {
    let nouveaux
    if (edition === 'nouveau') nouveaux = [...items, versItem(brouillon, { id: Date.now() })]
    else nouveaux = items.map((it, i) => (i === edition ? versItem(brouillon, it) : it))
    setItems(nouveaux); await setter(nouveaux)
    setSauvegarde(true); setTimeout(() => setSauvegarde(false), 2000)
    setEdition(null); setBrouillon(vide)
  }
  const supprimer = async (i) => {
    if (!confirm('Supprimer cet élément ?')) return
    const nouveaux = items.filter((_, idx) => idx !== i)
    setItems(nouveaux); await setter(nouveaux)
  }

  if (chargement) return <div className="p-8 flex items-center gap-3 text-gray-400 text-sm"><div className="w-4 h-4 border-2 border-[#0A69AD] border-t-transparent rounded-full animate-spin" /> Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-black text-[#065280]">{titre}</h2>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <button onClick={() => { setBrouillon(vide); setEdition('nouveau') }}
          className="bg-[#0A69AD] hover:bg-[#065280] text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {sauvegarde && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-xl mt-3">
          <CheckCircle2 size={14} /> Enregistré dans Supabase ✓
        </div>
      )}

      {edition !== null && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-2xl p-5 my-4 space-y-3">
          <h3 className="font-bold text-[#065280] text-sm">{edition === 'nouveau' ? 'Nouvel élément' : 'Modifier'}</h3>
          {champs.map((c) => (
            <div key={c.cle}>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{c.label}</label>
              {c.type === 'textarea' ? (
                <textarea rows={4} value={brouillon[c.cle] || ''}
                  onChange={(e) => setBrouillon({ ...brouillon, [c.cle]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white resize-none" />
              ) : (
                <input value={brouillon[c.cle] || ''}
                  onChange={(e) => setBrouillon({ ...brouillon, [c.cle]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
              )}
            </div>
          ))}
          <div className="flex gap-2 pt-1">
            <button onClick={sauvegarder} className="bg-[#C9A227] text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm hover:bg-[#b8932a] transition-colors">Enregistrer</button>
            <button onClick={() => { setEdition(null); setBrouillon(vide) }} className="text-gray-500 px-4 py-2.5 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-2 mt-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-xl p-3.5 flex items-center gap-3 hover:border-gray-200">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#065280] text-sm truncate">{item[champs[0].cle]}</p>
              {champs[1] && <p className="text-gray-400 text-xs truncate mt-0.5">{String(item[champs[1].cle] || '').slice(0, 80)}</p>}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => { setBrouillon(versBrouillon(item)); setEdition(i) }}
                className="text-[#0A69AD] p-2 hover:bg-[#F4F6F8] rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => supprimer(i)}
                className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="bg-[#F4F6F8] rounded-2xl p-8 text-center">
            <p className="text-gray-400 text-sm">Aucun élément. Cliquez sur "Ajouter" pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SECTION FORMATIONS
// ============================================
function SectionFormations() {
  const [items, setItems] = useState([])
  const [chargement, setChargement] = useState(true)
  const [edition, setEdition] = useState(null)
  const vide = { titre: '', accroche: '', places: '', prochainesSessions: '', publicVise: '', tarifEtudiant: '', tarifSalarie: '', tarifChef: '' }
  const [brouillon, setBrouillon] = useState(vide)

  useEffect(() => {
    let actif = true
    store.getFormations().then((data) => { if (actif) { setItems(data || []); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const versBrouillon = (f) => ({
    titre: f.titre || '', accroche: f.accroche || '', places: f.places || '',
    prochainesSessions: (f.prochainesSessions || []).join('\n'), publicVise: f.publicVise || '',
    tarifEtudiant: f.tarifs?.[0]?.prix || '', tarifSalarie: f.tarifs?.[1]?.prix || '', tarifChef: f.tarifs?.[2]?.prix || '',
  })

  const versFormation = (b, ancien = {}) => ({
    duree: '3 mois (12 semaines) — 240 heures', vagueMatin: '08h00 – 12h00', vagueApresMidi: '13h00 – 17h00',
    attestation: 'Attestation BKSC avec mention (note /20)', paiement: '3 tranches mensuelles accessibles',
    fraisInscription: '10 000 FCFA (non remboursables)', minimumApprenants: 6, programme: [],
    ...ancien, titre: b.titre, accroche: b.accroche, places: b.places,
    prochainesSessions: b.prochainesSessions.split('\n').map(s => s.trim()).filter(Boolean),
    publicVise: b.publicVise,
    tarifs: [
      { segment: "Étudiant(e)s", prix: b.tarifEtudiant },
      { segment: "Salarié(e)s", prix: b.tarifSalarie },
      { segment: "Chef(fe)s d'entreprise", prix: b.tarifChef },
    ],
  })

  const sauvegarder = async () => {
    let nouveaux
    if (edition === 'nouveau') nouveaux = [...items, versFormation(brouillon, { id: Date.now() })]
    else nouveaux = items.map((it, i) => (i === edition ? versFormation(brouillon, it) : it))
    setItems(nouveaux); await store.setFormations(nouveaux); setEdition(null); setBrouillon(vide)
  }
  const supprimer = async (i) => {
    if (!confirm('Supprimer cette formation ?')) return
    const nouveaux = items.filter((_, idx) => idx !== i)
    setItems(nouveaux); await store.setFormations(nouveaux)
  }

  const champ = (cle, label, type = 'text') => (
    <div key={cle}>
      <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={2} value={brouillon[cle]} onChange={(e) => setBrouillon({ ...brouillon, [cle]: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white resize-none" />
      ) : (
        <input value={brouillon[cle]} onChange={(e) => setBrouillon({ ...brouillon, [cle]: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
      )}
    </div>
  )

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-[#065280]">Formations</h2>
          <p className="text-xs text-gray-500">Gérez vos 4 modules certifiants</p>
        </div>
        <button onClick={() => { setBrouillon(vide); setEdition('nouveau') }}
          className="bg-[#0A69AD] hover:bg-[#065280] text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {edition !== null && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-2xl p-5 mb-4 space-y-3">
          {champ('titre', 'Titre de la formation')}
          {champ('accroche', 'Accroche courte')}
          {champ('places', 'Places disponibles')}
          {champ('prochainesSessions', 'Sessions (une par ligne)', 'textarea')}
          {champ('publicVise', 'Public visé')}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {champ('tarifEtudiant', 'Tarif Étudiants')}
            {champ('tarifSalarie', 'Tarif Salariés')}
            {champ('tarifChef', "Tarif Chefs d'ent.")}
          </div>
          <div className="flex gap-2">
            <button onClick={sauvegarder} className="bg-[#C9A227] text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm">Enregistrer</button>
            <button onClick={() => setEdition(null)} className="text-gray-500 px-4 py-2.5 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#065280] text-sm truncate">{item.titre}</p>
              <p className="text-gray-400 text-xs truncate mt-0.5">{item.accroche}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => { setBrouillon(versBrouillon(item)); setEdition(i) }} className="text-[#0A69AD] p-2 hover:bg-[#F4F6F8] rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => supprimer(i)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// SECTION ÉQUIPE
// ============================================
function SectionEquipe() {
  const [items, setItems] = useState([])
  const [chargement, setChargement] = useState(true)
  const [edition, setEdition] = useState(null)
  const [uploading, setUploading] = useState(false)
  const vide = { nom: '', role: '', photo: '' }
  const [brouillon, setBrouillon] = useState(vide)

  useEffect(() => {
    let actif = true
    store.getEquipe().then((data) => { if (actif) { setItems(data || []); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const handlePhotoUpload = async (e) => {
    const fichier = e.target.files[0]; if (!fichier) return
    setUploading(true)
    try { const url = await uploadCloudinary(fichier, 'image'); setBrouillon(b => ({ ...b, photo: url })) }
    catch (err) { alert('Erreur upload: ' + err.message) }
    setUploading(false)
  }

  const sauvegarder = async () => {
    if (!brouillon.nom) { alert('Le nom est obligatoire.'); return }
    let nouveaux
    if (edition === 'nouveau') nouveaux = [...items, { ...brouillon, id: Date.now() }]
    else nouveaux = items.map((it, i) => (i === edition ? { ...it, ...brouillon } : it))
    setItems(nouveaux); await store.setEquipe(nouveaux); setEdition(null); setBrouillon(vide)
  }
  const supprimer = async (i) => {
    if (!confirm('Supprimer ce membre ?')) return
    const nouveaux = items.filter((_, idx) => idx !== i)
    setItems(nouveaux); await store.setEquipe(nouveaux)
  }

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-[#065280]">Équipe & Photos</h2>
          <p className="text-xs text-gray-500">Uploadez les photos directement depuis votre appareil</p>
        </div>
        <button onClick={() => { setBrouillon(vide); setEdition('nouveau') }}
          className="bg-[#0A69AD] hover:bg-[#065280] text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {edition !== null && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-2xl p-5 mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Nom complet *</label>
              <input value={brouillon.nom} onChange={(e) => setBrouillon({ ...brouillon, nom: e.target.value })} placeholder="Ex: Boukeu Florian"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Fonction *</label>
              <input value={brouillon.role} onChange={(e) => setBrouillon({ ...brouillon, role: e.target.value })} placeholder="Ex: Directeur Général"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-2">Photo</label>
            {brouillon.photo ? (
              <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-green-200">
                <img src={brouillon.photo} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-[#0A69AD]" />
                <div>
                  <p className="text-xs font-bold text-green-600">✅ Photo chargée</p>
                  <button onClick={() => setBrouillon(b => ({ ...b, photo: '' }))} className="text-xs text-red-500 hover:underline mt-0.5">Changer</button>
                </div>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer ${uploading ? 'border-[#0A69AD] bg-blue-50' : 'border-gray-300 hover:border-[#0A69AD] bg-white'}`}>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} className="hidden" />
                {uploading ? (
                  <div className="flex items-center gap-2 text-[#0A69AD]">
                    <div className="w-4 h-4 border-2 border-[#0A69AD] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold">Upload…</span>
                  </div>
                ) : (
                  <div className="text-center"><Camera className="text-gray-400 mx-auto mb-1" size={22} /><p className="text-sm font-semibold text-[#065280]">Depuis l'appareil</p><p className="text-xs text-gray-400">JPG, PNG, WEBP</p></div>
                )}
              </label>
            )}
            <div className="mt-2">
              <label className="text-xs text-gray-400 block mb-1">Ou coller un lien :</label>
              <input value={brouillon.photo} onChange={(e) => setBrouillon({ ...brouillon, photo: e.target.value })} placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={sauvegarder} disabled={!brouillon.nom || uploading} className="bg-[#C9A227] text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm disabled:opacity-50">Enregistrer</button>
            <button onClick={() => setEdition(null)} className="text-gray-500 px-4 py-2.5 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0A69AD] to-[#065280] flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              {item.photo ? <img src={item.photo} alt={item.nom} className="w-full h-full object-cover" /> : <User className="text-white" size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#065280] text-sm truncate">{item.nom}</p>
              <p className="text-[#0A69AD] text-xs font-semibold mt-0.5">{item.role}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => { setBrouillon({ nom: item.nom || '', role: item.role || '', photo: item.photo || '' }); setEdition(i) }} className="text-[#0A69AD] p-2 hover:bg-[#F4F6F8] rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => supprimer(i)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-2 bg-[#F4F6F8] rounded-2xl p-8 text-center">
            <User className="text-gray-300 mx-auto mb-2" size={32} />
            <p className="text-gray-400 text-sm">Aucun membre. Ajoutez les membres de l'équipe.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SECTION TÉMOIGNAGES
// ============================================
function SectionTemoignages() {
  const [items, setItems] = useState([])
  const [chargement, setChargement] = useState(true)
  const [edition, setEdition] = useState(null)
  const [uploading, setUploading] = useState(false)
  const vide = { nom: '', entreprise: '', texte: '', note: '5', photo: '' }
  const [brouillon, setBrouillon] = useState(vide)

  useEffect(() => {
    let actif = true
    store.getTemoignages().then((data) => { if (actif) { setItems(data || []); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const handlePhotoUpload = async (e) => {
    const fichier = e.target.files[0]; if (!fichier) return
    setUploading(true)
    try { const url = await uploadCloudinary(fichier, 'image'); setBrouillon(b => ({ ...b, photo: url })) }
    catch (err) { alert('Erreur: ' + err.message) }
    setUploading(false)
  }

  const sauvegarder = async () => {
    if (!brouillon.nom || !brouillon.texte) { alert('Nom et texte obligatoires.'); return }
    const item = { ...brouillon, note: parseInt(brouillon.note) || 5, id: Date.now() }
    let nouveaux
    if (edition === 'nouveau') nouveaux = [...items, item]
    else nouveaux = items.map((it, i) => (i === edition ? { ...it, ...item } : it))
    setItems(nouveaux); await store.setTemoignages(nouveaux); setEdition(null); setBrouillon(vide)
  }
  const supprimer = async (i) => {
    if (!confirm('Supprimer ce témoignage ?')) return
    const nouveaux = items.filter((_, idx) => idx !== i)
    setItems(nouveaux); await store.setTemoignages(nouveaux)
  }

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-[#065280]">Témoignages</h2>
          <p className="text-xs text-gray-500">Apparaissent en carousel sur la page d'accueil</p>
        </div>
        <button onClick={() => { setBrouillon(vide); setEdition('nouveau') }}
          className="bg-[#0A69AD] hover:bg-[#065280] text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {edition !== null && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-2xl p-5 mb-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Nom du client *</label>
              <input value={brouillon.nom} onChange={(e) => setBrouillon({ ...brouillon, nom: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Entreprise</label>
              <input value={brouillon.entreprise} onChange={(e) => setBrouillon({ ...brouillon, entreprise: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Témoignage *</label>
            <textarea rows={4} value={brouillon.texte} onChange={(e) => setBrouillon({ ...brouillon, texte: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white resize-none" />
          </div>
          <div className="flex items-center gap-6">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Note</label>
              <select value={brouillon.note} onChange={(e) => setBrouillon({ ...brouillon, note: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Photo</label>
              <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 cursor-pointer text-sm text-gray-600 hover:border-[#0A69AD]">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} className="hidden" />
                {uploading ? '⏳ Upload…' : brouillon.photo ? '✅ Chargée' : '📸 Photo client'}
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={sauvegarder} className="bg-[#C9A227] text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm">Enregistrer</button>
            <button onClick={() => setEdition(null)} className="text-gray-500 px-4 py-2.5 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-2 mt-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0A69AD] flex items-center justify-center overflow-hidden shrink-0">
                {item.photo ? <img src={item.photo} alt={item.nom} className="w-full h-full object-cover" /> : <User className="text-white" size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-[#065280] text-sm">{item.nom}</p>
                  {item.entreprise && <span className="text-xs text-gray-400">· {item.entreprise}</span>}
                  <div className="flex gap-0.5 ml-auto">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= (item.note || 5) ? 'text-[#C9A227] fill-[#C9A227]' : 'text-gray-300'} />)}
                  </div>
                </div>
                <p className="text-gray-500 text-xs line-clamp-2">{item.texte}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => { setBrouillon({ nom: item.nom || '', entreprise: item.entreprise || '', texte: item.texte || '', note: String(item.note || 5), photo: item.photo || '' }); setEdition(i) }}
                  className="text-[#0A69AD] p-1.5 hover:bg-[#F4F6F8] rounded-lg"><Pencil size={13} /></button>
                <button onClick={() => supprimer(i)} className="text-red-400 p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="bg-[#F4F6F8] rounded-2xl p-8 text-center">
            <Quote className="text-gray-300 mx-auto mb-2" size={28} />
            <p className="text-gray-400 text-sm">Aucun témoignage. Ajoutez les retours de vos clients.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SECTION GALERIE
// ============================================
function SectionGalerie() {
  const [items, setItems] = useState([])
  const [chargement, setChargement] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progression, setProgression] = useState(0)
  const [urlTemp, setUrlTemp] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [brouillon, setBrouillon] = useState({ caption: '', categorie: 'cabinet' })

  useEffect(() => {
    let actif = true
    store.getGalerie().then((data) => { if (actif) { setItems(data || []); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const handleUpload = async (e) => {
    const fichier = e.target.files[0]; if (!fichier) return
    setUploading(true); setProgression(0); setShowForm(true)
    try { const url = await uploadCloudinary(fichier, 'image', setProgression); setUrlTemp(url) }
    catch (err) { alert('Erreur: ' + err.message); setShowForm(false) }
    setUploading(false)
  }

  const ajouter = async () => {
    if (!urlTemp) return
    const nouveau = { id: Date.now(), url: urlTemp, caption: brouillon.caption, categorie: brouillon.categorie }
    const nouveaux = [...items, nouveau]
    setItems(nouveaux); await store.setGalerie(nouveaux)
    setUrlTemp(''); setBrouillon({ caption: '', categorie: 'cabinet' }); setShowForm(false)
  }

  const supprimer = async (i) => {
    if (!confirm('Retirer cette photo ?')) return
    const nouveaux = items.filter((_, idx) => idx !== i)
    setItems(nouveaux); await store.setGalerie(nouveaux)
  }

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-[#065280]">Galerie Photos</h2>
          <p className="text-xs text-gray-500">Ces photos s'affichent sur la page d'accueil</p>
        </div>
        <label className="bg-[#0A69AD] hover:bg-[#065280] text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
          <Plus size={16} /> Ajouter
        </label>
      </div>

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
            <div className="bg-[#0A69AD] h-2 rounded-full transition-all" style={{ width: `${progression}%` }} />
          </div>
          <p className="text-xs text-[#0A69AD] font-semibold">Upload… {progression}%</p>
        </div>
      )}

      {showForm && urlTemp && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-2xl p-4 mb-4 space-y-3">
          <div className="flex gap-4">
            <img src={urlTemp} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
            <div className="flex-1 space-y-2">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Légende</label>
                <input value={brouillon.caption} onChange={(e) => setBrouillon(b => ({ ...b, caption: e.target.value }))}
                  placeholder="Ex: Salle de formation BKSC"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Catégorie</label>
                <select value={brouillon.categorie} onChange={(e) => setBrouillon(b => ({ ...b, categorie: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white">
                  <option value="cabinet">Cabinet</option>
                  <option value="formation">Formation</option>
                  <option value="equipe">Équipe</option>
                  <option value="evenement">Événement</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={ajouter} className="bg-[#C9A227] text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm">Ajouter à la galerie</button>
            <button onClick={() => { setShowForm(false); setUrlTemp('') }} className="text-gray-500 px-4 py-2.5 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <div key={item.id || i} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
            <img src={item.url} alt={item.caption || ''} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#065280]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              {item.caption && <p className="text-white text-xs font-semibold px-2 text-center">{item.caption}</p>}
              <button onClick={() => supprimer(i)} className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold">Supprimer</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-4 bg-[#F4F6F8] rounded-2xl p-10 text-center">
            <Camera className="text-gray-300 mx-auto mb-3" size={36} />
            <p className="text-gray-400 text-sm">Aucune photo. Ajoutez des photos du cabinet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SECTION VIDÉO HERO
// ============================================
function SectionMedias() {
  const [media, setMedia] = useState({ heroVideoUrl: '' })
  const [chargement, setChargement] = useState(true)
  const [enregistre, setEnregistre] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progression, setProgression] = useState(0)

  useEffect(() => {
    let actif = true
    store.getMedia().then((data) => { if (actif) { setMedia(data || { heroVideoUrl: '' }); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const handleFichier = async (e) => {
    const fichier = e.target.files[0]; if (!fichier) return
    setUploading(true); setProgression(0)
    try {
      const url = await uploadCloudinary(fichier, 'video', setProgression)
      const nouveauMedia = { ...media, heroVideoUrl: url }
      setMedia(nouveauMedia); await store.setMedia(nouveauMedia)
      setEnregistre(true); setTimeout(() => setEnregistre(false), 3000)
    } catch (err) { alert('Erreur: ' + err.message) }
    setUploading(false); setProgression(0)
  }

  const sauvegarderLien = async () => {
    await store.setMedia(media)
    setEnregistre(true); setTimeout(() => setEnregistre(false), 2000)
  }

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-lg font-black text-[#065280] mb-1">Vidéo Hero</h2>
      <p className="text-xs text-gray-500 mb-5">Vidéo en fond sur l'accueil. Si vide, la vidéo locale par défaut est utilisée.</p>
      <div className="bg-[#F4F6F8] border border-gray-200 rounded-2xl p-5 space-y-5 max-w-xl">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">📁 Uploader depuis l'appareil</p>
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${uploading ? 'border-[#0A69AD] bg-blue-50' : 'border-gray-300 hover:border-[#0A69AD] bg-white'}`}>
            <input type="file" accept="video/*" onChange={handleFichier} disabled={uploading} className="hidden" />
            {uploading ? (
              <div className="text-center px-6 w-full">
                <div className="w-full bg-blue-200 rounded-full h-3 mb-2"><div className="bg-[#0A69AD] h-3 rounded-full transition-all" style={{ width: `${progression}%` }} /></div>
                <p className="text-[#0A69AD] font-semibold text-sm">Upload… {progression}%</p>
              </div>
            ) : (
              <div className="text-center"><p className="text-3xl mb-1">🎬</p><p className="text-sm font-bold text-[#065280]">Choisir une vidéo</p><p className="text-xs text-gray-400">MP4, MOV — max 100MB</p></div>
            )}
          </label>
        </div>
        {media.heroVideoUrl && media.heroVideoUrl.startsWith('http') && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">✅ Vidéo uploadée</p>
            <video src={media.heroVideoUrl} controls className="w-full rounded-xl max-h-36 object-cover" />
            <button onClick={() => { setMedia({ ...media, heroVideoUrl: '' }); store.setMedia({ ...media, heroVideoUrl: '' }) }}
              className="mt-2 text-red-400 text-xs font-semibold hover:underline">🗑 Revenir à la vidéo par défaut</button>
          </div>
        )}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">🔗 Ou coller un lien .mp4</p>
          <div className="flex gap-2">
            <input value={media.heroVideoUrl || ''} onChange={(e) => setMedia({ ...media, heroVideoUrl: e.target.value })} placeholder="https://..."
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white min-w-0" />
            <button onClick={sauvegarderLien} className="bg-[#C9A227] text-[#065280] font-black px-4 py-2 rounded-xl text-sm shrink-0">
              {enregistre ? '✓ OK' : 'Sauver'}
            </button>
          </div>
        </div>
        {enregistre && <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-3 py-2 flex items-center gap-2"><CheckCircle2 size={13} /> Enregistré dans Supabase !</div>}
      </div>
    </div>
  )
}

// ============================================
// SECTION PARAMÈTRES
// ============================================
function SectionParametres() {
  const [settings, setSettings] = useState({})
  const [chargement, setChargement] = useState(true)
  const [sauvegarde, setSauvegarde] = useState(false)
  const [enregistre, setEnregistre] = useState(false)

  useEffect(() => {
    let actif = true
    store.getSettings().then((data) => { if (actif) { setSettings(data || {}); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const sauvegarder = async () => {
    setSauvegarde(true)
    await store.setSettings(settings)
    setSauvegarde(false); setEnregistre(true); setTimeout(() => setEnregistre(false), 3000)
  }

  const champ = (cle, label, placeholder = '') => (
    <div key={cle}>
      <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
      <input value={settings[cle] || ''} onChange={(e) => setSettings(s => ({ ...s, [cle]: e.target.value }))} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0A69AD] bg-white" />
    </div>
  )

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-[#065280]">Paramètres du site</h2>
          <p className="text-xs text-gray-500">Contacts et réseaux sociaux</p>
        </div>
        <button onClick={sauvegarder} disabled={sauvegarde}
          className="bg-[#C9A227] hover:bg-[#b8932a] disabled:opacity-60 text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors">
          {sauvegarde ? <><div className="w-3.5 h-3.5 border-2 border-[#065280] border-t-transparent rounded-full animate-spin" /> Sauvegarde…</> : <><CheckCircle2 size={15} /> Enregistrer</>}
        </button>
      </div>
      {enregistre && <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-xl mb-4"><CheckCircle2 size={14} /> Paramètres enregistrés dans Supabase !</div>}
      <div className="space-y-5">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="font-black text-[#065280] text-sm mb-4 flex items-center gap-2"><div className="w-6 h-6 bg-[#0A69AD] rounded-lg flex items-center justify-center"><Settings className="text-white" size={12} /></div> Coordonnées</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {champ('telephonePrincipal', 'Téléphone principal', '+237 6XX XX XX XX')}
            {champ('telephoneSecondaire', 'Téléphone secondaire', '+237 6XX XX XX XX')}
            {champ('whatsapp', 'WhatsApp (sans +)', '237657378927')}
            {champ('email', 'Email', 'bksuccessconsulting@gmail.com')}
            <div className="md:col-span-2">{champ('adresse', 'Adresse', 'Ndogbong Citadelle, Douala...')}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="font-black text-[#065280] text-sm mb-4 flex items-center gap-2"><div className="w-6 h-6 bg-[#C9A227] rounded-lg flex items-center justify-center"><TrendingUp className="text-[#065280]" size={12} /></div> Réseaux sociaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {champ('facebook', 'Facebook', 'https://facebook.com/...')}
            {champ('linkedin', 'LinkedIn', 'https://linkedin.com/...')}
            {champ('instagram', 'Instagram', 'https://instagram.com/...')}
            {champ('youtube', 'YouTube', 'https://youtube.com/...')}
            {champ('tiktok', 'TikTok', 'https://tiktok.com/...')}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SECTION ANNONCES
// ============================================
function SectionAnnonces() {
  const [annonces, setAnnonces] = useState([])
  const [chargement, setChargement] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const vide = { titre: '', contenu: '', type: 'bandeau', image_url: '', date_fin: '', actif: true }
  const [brouillon, setBrouillon] = useState(vide)

  const charger = async () => { setChargement(true); setAnnonces(await store.getAnnonces()); setChargement(false) }
  useEffect(() => { charger() }, [])

  const handleImageUpload = async (e) => {
    const fichier = e.target.files[0]; if (!fichier) return
    setUploading(true)
    try { const url = await uploadCloudinary(fichier, 'image'); setBrouillon(b => ({ ...b, image_url: url })) }
    catch (err) { alert('Erreur: ' + err.message) }
    setUploading(false)
  }

  const sauvegarder = async () => {
    if (!brouillon.titre) { alert('Le titre est obligatoire.'); return }
    const annonce = { titre: brouillon.titre, contenu: brouillon.contenu || '', type: brouillon.type, image_url: brouillon.image_url || null, actif: brouillon.actif, date_fin: brouillon.date_fin ? new Date(brouillon.date_fin).toISOString() : null }
    const result = await store.addAnnonce(annonce)
    if (result) { setBrouillon(vide); setShowForm(false); charger() }
    else alert('Erreur Supabase. Vérifiez que la table "annonces" existe.')
  }

  const toggleActif = async (annonce) => { await store.updateAnnonce(annonce.id, { actif: !annonce.actif }); charger() }
  const supprimer = async (id) => { if (!confirm('Supprimer définitivement ?')) return; await store.deleteAnnonce(id); charger() }

  const typeBadges = {
    bandeau: { label: '📢 Bandeau', color: 'bg-blue-100 text-blue-700' },
    popup: { label: '🪟 Popup', color: 'bg-purple-100 text-purple-700' },
    statut: { label: '💬 Statut', color: 'bg-green-100 text-green-700' },
    alerte: { label: '🔔 Alerte', color: 'bg-red-100 text-red-700' },
  }

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-[#065280]">Annonces & Statuts</h2>
          <p className="text-xs text-gray-500">Visibles par tous les visiteurs du site</p>
        </div>
        <button onClick={() => { setBrouillon(vide); setShowForm(true) }}
          className="bg-[#0A69AD] hover:bg-[#065280] text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
          <Plus size={16} /> Nouvelle
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {[{ type: 'bandeau', icon: '📢', desc: 'Texte en haut' }, { type: 'popup', icon: '🪟', desc: "Fenêtre d'arrivée" }, { type: 'statut', icon: '💬', desc: 'Carte accueil' }, { type: 'alerte', icon: '🔔', desc: 'Alerte rouge' }].map(t => (
          <div key={t.type} className="bg-white border border-gray-100 rounded-xl p-3 text-center">
            <p className="text-xl">{t.icon}</p><p className="text-xs font-bold text-[#065280] capitalize mt-1">{t.type}</p><p className="text-xs text-gray-400">{t.desc}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-2xl p-5 mb-4 space-y-3">
          <h3 className="font-bold text-[#065280] text-sm">Nouvelle annonce</h3>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Titre *</label>
            <input value={brouillon.titre} onChange={(e) => setBrouillon({ ...brouillon, titre: e.target.value })} placeholder="Ex: Inscriptions ouvertes — Formation Fiscalité 2026"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Message</label>
            <textarea rows={2} value={brouillon.contenu} onChange={(e) => setBrouillon({ ...brouillon, contenu: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Type</label>
              <select value={brouillon.type} onChange={(e) => setBrouillon({ ...brouillon, type: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white">
                <option value="bandeau">📢 Bandeau</option>
                <option value="popup">🪟 Popup</option>
                <option value="statut">💬 Statut</option>
                <option value="alerte">🔔 Alerte</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Expire le</label>
              <input type="datetime-local" value={brouillon.date_fin} onChange={(e) => setBrouillon({ ...brouillon, date_fin: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-2">Image (optionnel)</label>
            {brouillon.image_url ? (
              <div className="relative mb-2">
                <img src={brouillon.image_url} alt="" className="w-full h-28 object-cover rounded-xl" />
                <button onClick={() => setBrouillon(b => ({ ...b, image_url: '' }))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 h-14 border-2 border-dashed border-gray-300 hover:border-[#0A69AD] rounded-xl cursor-pointer bg-white">
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                <span className="text-sm text-gray-500">{uploading ? '⏳ Upload…' : '🖼️ Ajouter une image'}</span>
              </label>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="actif_f" checked={brouillon.actif} onChange={(e) => setBrouillon({ ...brouillon, actif: e.target.checked })} className="w-4 h-4 rounded accent-[#0A69AD]" />
            <label htmlFor="actif_f" className="text-sm text-gray-600 cursor-pointer">Publier immédiatement</label>
          </div>
          <div className="flex gap-2">
            <button onClick={sauvegarder} className="bg-[#C9A227] text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm">Publier</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2.5 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {annonces.length === 0 && !showForm && (
          <div className="bg-[#F4F6F8] rounded-2xl p-10 text-center">
            <p className="text-3xl mb-2">📢</p><p className="text-gray-400 text-sm">Aucune annonce. Créez votre première annonce.</p>
          </div>
        )}
        {annonces.map((annonce) => {
          const badge = typeBadges[annonce.type] || { label: annonce.type, color: 'bg-gray-100 text-gray-700' }
          const expire = annonce.date_fin ? new Date(annonce.date_fin) < new Date() : false
          return (
            <div key={annonce.id} className={`bg-white border rounded-2xl p-4 ${!annonce.actif || expire ? 'opacity-60 border-gray-100' : 'border-[#0A69AD]/20'}`}>
              <div className="flex items-start gap-3">
                {annonce.image_url && <img src={annonce.image_url} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                    {expire && <span className="text-xs text-red-500 font-semibold">⏰ Expirée</span>}
                    {!annonce.actif && !expire && <span className="text-xs text-gray-400 font-semibold">⏸ Inactive</span>}
                    {annonce.actif && !expire && <span className="text-xs text-green-600 font-semibold flex items-center gap-0.5"><CheckCircle2 size={11} /> Active</span>}
                  </div>
                  <p className="font-bold text-[#065280] text-sm">{annonce.titre}</p>
                  {annonce.contenu && <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{annonce.contenu}</p>}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button onClick={() => toggleActif(annonce)} className={`text-xs font-bold px-3 py-1.5 rounded-xl ${annonce.actif ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                    {annonce.actif ? 'Désactiver' : 'Activer'}
                  </button>
                  <button onClick={() => supprimer(annonce.id)} className="text-xs text-red-500 font-bold px-3 py-1.5 rounded-xl hover:bg-red-50">Supprimer</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// SECTION BLOG
// ============================================
function SectionBlog() {
  const [articles, setArticles] = useState([])
  const [chargement, setChargement] = useState(true)
  const [edition, setEdition] = useState(null)
  const [uploading, setUploading] = useState(false)

  const CATEGORIES = [
    { value: 'fiscalite', label: '📊 Fiscalité' },
    { value: 'comptabilite', label: '📋 Comptabilité OHADA' },
    { value: 'creation-entreprise', label: '🏢 Création d\'entreprise' },
    { value: 'conseils', label: '💡 Conseils & Gestion' },
    { value: 'actualites', label: '📰 Actualités' },
  ]

  const vide = { titre: '', extrait: '', contenu: '', image_url: '', categorie: 'actualites', publie: false }
  const [brouillon, setBrouillon] = useState(vide)

  const charger = async () => {
    setChargement(true)
    const data = await store.getBlogArticles()
    setArticles(data); setChargement(false)
  }
  useEffect(() => { charger() }, [])

  const handleImageUpload = async (e) => {
    const fichier = e.target.files[0]; if (!fichier) return
    setUploading(true)
    try { const url = await uploadCloudinary(fichier, 'image'); setBrouillon(b => ({ ...b, image_url: url })) }
    catch (err) { alert('Erreur: ' + err.message) }
    setUploading(false)
  }

  const sauvegarder = async () => {
    if (!brouillon.titre) { alert('Le titre est obligatoire.'); return }
    if (edition === 'nouveau') {
      const result = await store.addBlogArticle(brouillon)
      if (!result) { alert('Erreur Supabase. Vérifiez que la table blog_articles existe.'); return }
    } else {
      const ok = await store.updateBlogArticle(edition.id, brouillon)
      if (!ok) { alert('Erreur lors de la mise à jour.'); return }
    }
    setEdition(null); setBrouillon(vide); charger()
  }

  const togglePublie = async (article) => {
    await store.updateBlogArticle(article.id, { publie: !article.publie })
    charger()
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer définitivement cet article ?')) return
    await store.deleteBlogArticle(id); charger()
  }

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  // Vue formulaire (nouveau/modifier)
  if (edition !== null) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => { setEdition(null); setBrouillon(vide) }} className="text-[#0A69AD] text-sm font-bold hover:underline">← Retour</button>
          <h2 className="text-lg font-black text-[#065280]">{edition === 'nouveau' ? 'Nouvel article' : 'Modifier l\'article'}</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Titre *</label>
            <input value={brouillon.titre} onChange={e => setBrouillon(b => ({ ...b, titre: e.target.value }))}
              placeholder="Ex: Comprendre la TVA au Cameroun en 2026"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0A69AD] bg-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Catégorie</label>
              <select value={brouillon.categorie} onChange={e => setBrouillon(b => ({ ...b, categorie: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0A69AD] bg-white">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 mt-5">
              <input type="checkbox" id="publie_check" checked={brouillon.publie}
                onChange={e => setBrouillon(b => ({ ...b, publie: e.target.checked }))}
                className="w-4 h-4 rounded accent-[#0A69AD]" />
              <label htmlFor="publie_check" className="text-sm text-gray-700 font-semibold cursor-pointer">Publier sur le site</label>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Extrait court (aperçu sur les cartes)</label>
            <textarea rows={2} value={brouillon.extrait} onChange={e => setBrouillon(b => ({ ...b, extrait: e.target.value }))}
              placeholder="Résumé en 1-2 phrases..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Contenu complet</label>
            <textarea rows={10} value={brouillon.contenu} onChange={e => setBrouillon(b => ({ ...b, contenu: e.target.value }))}
              placeholder="Rédigez ici le contenu complet de l'article..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-2">Image de couverture</label>
            {brouillon.image_url ? (
              <div className="relative mb-2">
                <img src={brouillon.image_url} alt="" className="w-full h-36 object-cover rounded-xl" />
                <button onClick={() => setBrouillon(b => ({ ...b, image_url: '' }))} className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
              </div>
            ) : (
              <label className={`flex items-center justify-center gap-2 h-16 border-2 border-dashed rounded-xl cursor-pointer bg-white transition-colors ${uploading ? 'border-[#0A69AD] bg-blue-50' : 'border-gray-300 hover:border-[#0A69AD]'}`}>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                <span className="text-sm text-gray-500">{uploading ? '⏳ Upload en cours…' : '🖼️ Ajouter une image de couverture'}</span>
              </label>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={sauvegarder} disabled={!brouillon.titre}
              className="bg-[#C9A227] text-[#065280] font-black px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 hover:bg-[#b8932a] transition-colors">
              {edition === 'nouveau' ? 'Créer l\'article' : 'Enregistrer'}
            </button>
            <button onClick={() => { setEdition(null); setBrouillon(vide) }} className="text-gray-500 px-5 py-2.5 text-sm">Annuler</button>
          </div>
        </div>
      </div>
    )
  }

  // Vue liste
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-[#065280]">Blog & Actualités</h2>
          <p className="text-xs text-gray-500">Articles publiés sur le site — optimisés pour Google</p>
        </div>
        <button onClick={() => { setBrouillon(vide); setEdition('nouveau') }}
          className="bg-[#0A69AD] hover:bg-[#065280] text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
          <Plus size={16} /> Nouvel article
        </button>
      </div>

      <div className="space-y-3">
        {articles.length === 0 && (
          <div className="bg-[#F4F6F8] rounded-2xl p-10 text-center">
            <p className="text-3xl mb-2">✍️</p>
            <p className="text-gray-400 text-sm">Aucun article. Créez votre premier article de blog.</p>
            <p className="text-gray-400 text-xs mt-1">Les articles aident à vous trouver sur Google.</p>
          </div>
        )}
        {articles.map((article) => {
          const categLabel = CATEGORIES.find(c => c.value === article.categorie)?.label || '📰 Actualités'
          return (
            <div key={article.id} className={`bg-white border rounded-2xl p-4 ${article.publie ? 'border-[#0A69AD]/20' : 'border-gray-100 opacity-70'}`}>
              <div className="flex gap-4 items-start">
                {article.image_url && <img src={article.image_url} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-xs bg-[#F4F6F8] text-[#065280] font-bold px-2 py-0.5 rounded-full">{categLabel}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${article.publie ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {article.publie ? <><CheckCircle2 size={10} /> Publié</> : '📝 Brouillon'}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="font-black text-[#065280] text-sm">{article.titre}</p>
                  {article.extrait && <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{article.extrait}</p>}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => { setBrouillon({ titre: article.titre, extrait: article.extrait || '', contenu: article.contenu || '', image_url: article.image_url || '', categorie: article.categorie || 'actualites', publie: article.publie }); setEdition(article) }}
                    className="text-[#0A69AD] text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#F4F6F8] flex items-center gap-1">
                    <Pencil size={12} /> Modifier
                  </button>
                  <button onClick={() => togglePublie(article)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${article.publie ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {article.publie ? 'Dépublier' : 'Publier'}
                  </button>
                  <button onClick={() => supprimer(article.id)} className="text-xs text-red-500 font-bold px-3 py-1.5 rounded-xl hover:bg-red-50">Supprimer</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
// ============================================
// SECTION VIDÉOS CABINET
// ============================================
function SectionGalerieVideos() {
  const [items, setItems] = useState([])
  const [chargement, setChargement] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progression, setProgression] = useState(0)
  const [urlTemp, setUrlTemp] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [brouillon, setBrouillon] = useState({ caption: '', categorie: 'cabinet' })

  useEffect(() => {
    let actif = true
    store.getGalerieVideos().then(data => { if (actif) { setItems(data || []); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const handleUpload = async (e) => {
    const fichier = e.target.files[0]; if (!fichier) return
    setUploading(true); setProgression(0); setShowForm(true)
    try { const url = await uploadCloudinary(fichier, 'video', setProgression); setUrlTemp(url) }
    catch (err) { alert('Erreur upload: ' + err.message); setShowForm(false) }
    setUploading(false)
  }

  const ajouter = async () => {
    if (!urlTemp) return
    const nouveau = { id: Date.now(), url: urlTemp, caption: brouillon.caption, categorie: brouillon.categorie }
    const nouveaux = [...items, nouveau]
    setItems(nouveaux); await store.setGalerieVideos(nouveaux)
    setUrlTemp(''); setBrouillon({ caption: '', categorie: 'cabinet' }); setShowForm(false)
  }

  const supprimer = async (i) => {
    if (!confirm('Supprimer cette vidéo ?')) return
    const nouveaux = items.filter((_, idx) => idx !== i)
    setItems(nouveaux); await store.setGalerieVideos(nouveaux)
  }

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-[#065280]">Vidéos du Cabinet</h2>
          <p className="text-xs text-gray-500">Vidéos de présentation, formations, événements</p>
        </div>
        <label className="bg-[#0A69AD] hover:bg-[#065280] text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors">
          <input type="file" accept="video/*" onChange={handleUpload} disabled={uploading} className="hidden" />
          <Plus size={16} /> Ajouter une vidéo
        </label>
      </div>

      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="w-full bg-blue-200 rounded-full h-2 mb-1">
            <div className="bg-[#0A69AD] h-2 rounded-full transition-all" style={{ width: `${progression}%` }} />
          </div>
          <p className="text-xs text-[#0A69AD] font-semibold text-center">Upload vidéo… {progression}%</p>
        </div>
      )}

      {showForm && urlTemp && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-2xl p-4 mb-4 space-y-3">
          <p className="font-bold text-[#065280] text-sm">✅ Vidéo uploadée — Ajouter des détails</p>
          <video src={urlTemp} controls className="w-full rounded-xl max-h-36 object-cover" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Légende (optionnel)</label>
              <input value={brouillon.caption} onChange={e => setBrouillon(b => ({ ...b, caption: e.target.value }))}
                placeholder="Ex: Séminaire fiscal 2026"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Catégorie</label>
              <select value={brouillon.categorie} onChange={e => setBrouillon(b => ({ ...b, categorie: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white">
                <option value="cabinet">Cabinet</option>
                <option value="formation">Formation</option>
                <option value="evenement">Événement</option>
                <option value="temoignage">Témoignage</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={ajouter} className="bg-[#C9A227] text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm">Ajouter à la galerie</button>
            <button onClick={() => { setShowForm(false); setUrlTemp('') }} className="text-gray-500 px-4 py-2.5 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <video src={item.url} controls className="w-full h-40 object-cover bg-gray-100" />
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-[#065280] text-sm truncate">{item.caption || 'Vidéo sans titre'}</p>
                <span className="text-[10px] bg-[#F4F6F8] text-[#065280] px-2 py-0.5 rounded-full font-semibold">{item.categorie}</span>
              </div>
              <button onClick={() => supprimer(i)} className="text-red-400 p-1.5 hover:bg-red-50 rounded-lg shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-2 bg-[#F4F6F8] rounded-2xl p-10 text-center">
            <p className="text-3xl mb-2">🎬</p>
            <p className="text-gray-400 text-sm">Aucune vidéo. Uploadez des vidéos du cabinet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SECTION QUIZ ADMIN
// ============================================
function SectionQuizAdmin() {
  const [customQuiz, setCustomQuiz] = useState({})
  const [chargement, setChargement] = useState(true)
  const [categorieActive, setCategorieActive] = useState('ohada')
  const [showForm, setShowForm] = useState(false)
  const [sauvegarde, setSauvegarde] = useState(false)
  const videForm = { question: '', optionA: '', optionB: '', optionC: '', optionD: '', reponse: '0', explication: '' }
  const [brouillon, setBrouillon] = useState(videForm)

  useEffect(() => {
    let actif = true
    store.getQuizCustom().then(data => {
      if (actif) {
        setCustomQuiz(data || { ohada: [], fiscalite: [], creation: [], social: [], audit: [] })
        setChargement(false)
      }
    })
    return () => { actif = false }
  }, [])

  const questionsCustomCat = customQuiz[categorieActive] || []
  const questionsHardcodees = (questionsHardcoded[categorieActive] || []).length

  const ajouter = async () => {
    if (!brouillon.question || !brouillon.optionA || !brouillon.optionB) {
      alert('Question et au moins 2 options obligatoires.')
      return
    }
    const options = [brouillon.optionA, brouillon.optionB, brouillon.optionC, brouillon.optionD].filter(Boolean)
    const nouvelleQuestion = {
      id: Date.now(),
      question: brouillon.question,
      options,
      reponse: Math.min(parseInt(brouillon.reponse), options.length - 1),
      explication: brouillon.explication || 'Pas d\'explication fournie.',
    }
    const nouveau = { ...customQuiz, [categorieActive]: [...questionsCustomCat, nouvelleQuestion] }
    setCustomQuiz(nouveau)
    await store.setQuizCustom(nouveau)
    setSauvegarde(true)
    setTimeout(() => setSauvegarde(false), 2000)
    setBrouillon(videForm)
    setShowForm(false)
  }

  const supprimer = async (idx) => {
    if (!confirm('Supprimer cette question ?')) return
    const nouveaux = questionsCustomCat.filter((_, i) => i !== idx)
    const nouveau = { ...customQuiz, [categorieActive]: nouveaux }
    setCustomQuiz(nouveau)
    await store.setQuizCustom(nouveau)
  }

  if (chargement) return <div className="p-8 text-gray-400 text-sm">Chargement…</div>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black text-[#065280]">Quiz — Gestion des questions</h2>
          <p className="text-xs text-gray-500">Ajoutez vos propres questions en plus des questions permanentes</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-[#0A69AD] hover:bg-[#065280] text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors">
          <Plus size={16} /> Nouvelle question
        </button>
      </div>

      {sauvegarde && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-xl mb-3">
          <CheckCircle2 size={14} /> Question enregistrée dans Supabase ✓
        </div>
      )}

      {/* Sélection catégorie */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setCategorieActive(cat.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              categorieActive === cat.id
                ? 'bg-[#065280] text-white shadow-md'
                : 'bg-[#F4F6F8] text-gray-600 hover:bg-gray-200'
            }`}>
            {cat.emoji} {cat.titre}
          </button>
        ))}
      </div>

      <div className="bg-[#F4F6F8] rounded-xl p-3 mb-4 flex items-center gap-3">
        <div className="text-center px-4 border-r border-gray-200">
          <p className="text-xl font-black text-[#065280]">{questionsHardcodees}</p>
          <p className="text-xs text-gray-400">Permanentes</p>
        </div>
        <div className="text-center px-4">
          <p className="text-xl font-black text-[#C9A227]">{questionsCustomCat.length}</p>
          <p className="text-xs text-gray-400">Vos questions</p>
        </div>
        <div className="text-center px-4 border-l border-gray-200">
          <p className="text-xl font-black text-green-600">{questionsHardcodees + questionsCustomCat.length}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-2xl p-5 mb-4 space-y-3">
          <h3 className="font-black text-[#065280] text-sm">Nouvelle question — {categories.find(c => c.id === categorieActive)?.titre}</h3>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Question *</label>
            <textarea rows={2} value={brouillon.question} onChange={e => setBrouillon(b => ({ ...b, question: e.target.value }))}
              placeholder="Ex: Quel est le taux de TVA au Cameroun ?"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['optionA', 'optionB', 'optionC', 'optionD'].map((key, i) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Option {String.fromCharCode(65 + i)} {i < 2 ? '*' : ''}</label>
                <input value={brouillon[key]} onChange={e => setBrouillon(b => ({ ...b, [key]: e.target.value }))}
                  placeholder={`Réponse ${String.fromCharCode(65 + i)}`}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Bonne réponse *</label>
              <select value={brouillon.reponse} onChange={e => setBrouillon(b => ({ ...b, reponse: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white">
                {['A', 'B', 'C', 'D'].map((l, i) => <option key={i} value={i}>Option {l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Explication</label>
              <input value={brouillon.explication} onChange={e => setBrouillon(b => ({ ...b, explication: e.target.value }))}
                placeholder="Pourquoi cette réponse ?"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={ajouter} className="bg-[#C9A227] text-[#065280] font-black px-5 py-2.5 rounded-xl text-sm">Ajouter la question</button>
            <button onClick={() => { setShowForm(false); setBrouillon(videForm) }} className="text-gray-500 px-4 py-2.5 text-sm">Annuler</button>
          </div>
        </div>
      )}

      {/* Questions permanentes (readonly) */}
      <div className="mb-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Questions permanentes (non modifiables) — {questionsHardcodees}</p>
        <div className="space-y-1.5">
          {(questionsHardcoded[categorieActive] || []).map((q, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-2 opacity-60">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
              <p className="text-gray-500 text-xs truncate flex-1">{q.question}</p>
              <span className="text-[10px] text-gray-400 shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">Fixe</span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions custom */}
      <div>
        <p className="text-xs font-bold text-[#065280] uppercase tracking-widest mb-2">Vos questions ajoutées — {questionsCustomCat.length}</p>
        <div className="space-y-2">
          {questionsCustomCat.map((q, i) => (
            <div key={q.id || i} className="bg-white border border-[#0A69AD]/20 rounded-xl p-3 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0A69AD] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{questionsHardcodees + i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#065280] text-xs font-bold truncate">{q.question}</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Bonne réponse : Option {String.fromCharCode(65 + q.reponse)}</p>
              </div>
              <button onClick={() => supprimer(i)} className="text-red-400 p-1.5 hover:bg-red-50 rounded-lg shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {questionsCustomCat.length === 0 && (
            <div className="bg-[#F4F6F8] rounded-xl p-5 text-center">
              <p className="text-gray-400 text-xs">Aucune question personnalisée. Cliquez sur "Nouvelle question".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
// ============================================
// DASHBOARD PRINCIPAL
// ============================================
export default function AdminDashboard() {
  const [actif, setActif] = useState('accueil')
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false)
  const [dashStats, setDashStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const auth = sessionStorage.getItem('bksc_admin_auth')
    const timestamp = sessionStorage.getItem('bksc_admin_time')
    if (!auth || !timestamp || Date.now() - parseInt(timestamp) > 4 * 60 * 60 * 1000) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    if (actif !== 'accueil') return
    Promise.all([
      store.getServices(), store.getFormations(), store.getEquipe(),
      store.getTemoignages(), store.getAnnonces(), store.getGalerie(), store.getBlogArticles()
    ]).then(([s, f, e, t, a, g, b]) => {
      setDashStats({
        services: (s || []).length,
        formations: (f || []).length,
        equipe: (e || []).filter(m => m.nom && !m.nom.startsWith('[')).length,
        temoignages: (t || []).length,
        annoncesActives: (a || []).filter(x => x.actif).length,
        galerie: (g || []).length,
        articles: (b || []).length,
        articlesPublies: (b || []).filter(x => x.publie).length,
      })
    })
  }, [actif])

  const deconnexion = () => { clearAdminSession(); navigate('/admin', { replace: true }) }
  const changerSection = (id) => { setActif(id); setMenuMobileOuvert(false) }

  const derniereConnexion = (() => {
    const ts = sessionStorage.getItem('bksc_admin_time')
    return ts ? new Date(parseInt(ts)).toLocaleString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' }) : null
  })()

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col md:flex-row">

      {/* HEADER MOBILE */}
      <div className="md:hidden bg-[#065280] flex items-center justify-between px-4 py-3 sticky top-0 z-50 shadow-xl">
        <img src="/logo.png" alt="BKSC" className="h-8 bg-white/95 rounded-lg p-1" />
        <div className="flex items-center gap-2">
          <span className="text-[#C9A227] text-xs font-bold truncate max-w-[130px]">{menu.find(m => m.id === actif)?.label}</span>
          <button onClick={() => setMenuMobileOuvert(!menuMobileOuvert)} className="text-white p-1.5 bg-white/10 rounded-lg">
            {menuMobileOuvert ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {menuMobileOuvert && (
        <div className="md:hidden bg-[#065280] border-t border-white/10 px-3 py-2 flex flex-col gap-1 sticky top-[52px] z-40 shadow-xl">
          {menu.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => changerSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${actif === item.id ? 'bg-[#C9A227] text-[#065280]' : 'text-gray-200 hover:bg-white/10'}`}>
                <Icon size={16} /> {item.label}
              </button>
            )
          })}
          <button onClick={deconnexion} className="flex items-center gap-3 px-4 py-2.5 text-red-300 text-sm mt-1 border-t border-white/10 pt-3 font-bold">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 bg-[#065280] text-white flex-col shrink-0 sticky top-0 h-screen shadow-2xl">
        <div className="p-5 border-b border-white/10">
          <img src="/logo.png" alt="BKSC" className="h-10 bg-white/95 rounded-xl p-1 mb-3" />
          <p className="text-[#C9A227] text-xs font-black tracking-widest uppercase">Administration</p>
          <p className="text-gray-400 text-xs mt-0.5">{cabinetInfo.nomComplet}</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => setActif(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${actif === item.id ? 'bg-[#C9A227] text-[#065280] shadow-md' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={17} /> {item.label}
              </button>
            )
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <button onClick={deconnexion} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-red-300 hover:bg-white/5 rounded-xl text-sm font-bold transition-colors">
            <LogOut size={17} /> Déconnexion
          </button>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-white text-xs rounded-xl hover:bg-white/5 transition-colors">
            ← Voir le site public
          </Link>
        </div>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 overflow-y-auto">
        {actif === 'accueil' && (
          <div className="p-4 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-[#065280]">Tableau de bord</h1>
              <p className="text-gray-400 text-sm mt-1">{derniereConnexion ? `Dernière connexion : ${derniereConnexion}` : 'Bienvenue'}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Services', valeur: dashStats?.services, icon: Briefcase, color: 'from-[#0A69AD] to-[#065280]', id: 'services' },
                { label: 'Formations', valeur: dashStats?.formations, icon: GraduationCap, color: 'from-[#065280] to-[#044060]', id: 'formations' },
                { label: 'Équipe', valeur: dashStats?.equipe, icon: Users, color: 'from-[#C9A227] to-[#b8932a]', id: 'equipe' },
                { label: 'Témoignages', valeur: dashStats?.temoignages, icon: Quote, color: 'from-[#0A69AD] to-[#065280]', id: 'temoignages' },
                { label: 'Annonces actives', valeur: dashStats?.annoncesActives, icon: Megaphone, color: 'from-[#065280] to-[#044060]', id: 'annonces' },
                { label: 'Photos galerie', valeur: dashStats?.galerie, icon: Camera, color: 'from-[#C9A227] to-[#b8932a]', id: 'galerie' },
                { label: 'Articles blog', valeur: dashStats?.articles, icon: FileText, color: 'from-[#0A69AD] to-[#065280]', id: 'blog' },
                { label: 'Articles publiés', valeur: dashStats?.articlesPublies, icon: CheckCircle2, color: 'from-green-600 to-green-700', id: 'blog' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <button key={stat.label} onClick={() => changerSection(stat.id)}
                    className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:shadow-lg hover:border-[#0A69AD]/20 hover:-translate-y-0.5 transition-all duration-200 group">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className="text-white" size={18} />
                    </div>
                    <p className="text-2xl font-black text-[#065280]">
                      {dashStats === null ? <span className="inline-block w-6 h-5 bg-gray-200 rounded animate-pulse" /> : (stat.valeur ?? 0)}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 font-semibold">{stat.label}</p>
                  </button>
                )
              })}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
              <h3 className="font-black text-[#065280] text-sm mb-3">Actions rapides</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Nouvelle annonce', id: 'annonces', icon: '📢' },
                  { label: 'Nouvel article', id: 'blog', icon: '✍️' },
                  { label: 'Ajouter photo', id: 'galerie', icon: '📸' },
                  { label: 'Paramètres', id: 'parametres', icon: '⚙️' },
                  { label: 'Vidéos cabinet', icon: '🎬', id: 'galerie_videos' },
                  { label: 'Quiz questions', icon: '🧠', id: 'quiz_admin' },
                ].map(action => (
                  <button key={action.id + action.label} onClick={() => changerSection(action.id)}
                    className="bg-[#F4F6F8] hover:bg-[#e8ecf0] border border-gray-100 rounded-xl p-3 text-center transition-colors text-xs font-semibold text-[#065280]">
                    <span className="text-xl block mb-1">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="text-green-600 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-bold">Connecté à Supabase</p>
                <p className="text-xs text-green-700 mt-0.5">Modifications synchronisées en temps réel sur tous les appareils.</p>
              </div>
            </div>
          </div>
        )}

        {actif === 'annonces' && <SectionAnnonces />}
        {actif === 'blog' && <SectionBlog />}
        {actif === 'services' && (
          <SectionListe titre="Services" description="Gérez les 6 services affichés sur le site" getter={store.getServices} setter={store.setServices}
            champs={[
              { cle: 'titre', label: 'Titre du service' },
              { cle: 'accroche', label: 'Accroche courte' },
              { cle: 'items', label: 'Prestations (une par ligne)', type: 'textarea', isArray: true },
            ]} />
        )}
        {actif === 'formations' && <SectionFormations />}
        {actif === 'galerie_videos' && <SectionGalerieVideos />}
        {actif === 'quiz_admin' && <SectionQuizAdmin />}
        {actif === 'equipe' && <SectionEquipe />}
        {actif === 'temoignages' && <SectionTemoignages />}
        {actif === 'galerie' && <SectionGalerie />}
        {actif === 'medias' && <SectionMedias />}
        {actif === 'parametres' && <SectionParametres />}
        {actif === 'messages' && (
          <div className="p-4 md:p-8">
            <h2 className="text-lg font-black text-[#065280] mb-1">Messages reçus</h2>
            <p className="text-xs text-gray-500 mb-6">Messages envoyés via le formulaire de contact</p>
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-3xl mb-3">📥</p>
              <p className="text-gray-400 text-sm">Les messages du formulaire apparaîtront ici prochainement.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}