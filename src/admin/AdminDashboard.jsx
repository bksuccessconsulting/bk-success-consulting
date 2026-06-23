import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, GraduationCap, Users, Quote, Image,
  Megaphone, Inbox, LogOut, Plus, Pencil, Trash2, Menu, X, User,
} from 'lucide-react'
import { store } from '../data/contentStore'
import { clearAdminSession } from './AdminGuard'

// ============================================
// HELPER CLOUDINARY
// ============================================
async function uploadCloudinary(fichier, type = 'image', onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', fichier)
    formData.append('upload_preset', 'bksc_upload')
    const xhr = new XMLHttpRequest()
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      }
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

const menu = [
  { id: 'accueil', label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: 'annonces', label: 'Annonces & Statuts', icon: Megaphone },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'formations', label: 'Formations', icon: GraduationCap },
  { id: 'equipe', label: 'Équipe & Photos', icon: Users },
  { id: 'temoignages', label: 'Témoignages', icon: Quote },
  { id: 'medias', label: 'Vidéo Hero', icon: Image },
  { id: 'messages', label: 'Messages', icon: Inbox },
]

// ============================================
// SECTION LISTE GÉNÉRIQUE
// ============================================
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

  const sauvegarder = async () => {
    let nouveaux
    if (edition === 'nouveau') nouveaux = [...items, versItem(brouillon, { id: Date.now() })]
    else nouveaux = items.map((it, i) => (i === edition ? versItem(brouillon, it) : it))
    setItems(nouveaux); await setter(nouveaux); setEdition(null); setBrouillon(vide)
  }
  const supprimer = async (i) => {
    if (!confirm('Supprimer cet élément ?')) return
    const nouveaux = items.filter((_, idx) => idx !== i)
    setItems(nouveaux); await setter(nouveaux)
  }

  if (chargement) return <p className="text-gray-400 text-sm p-4">Chargement…</p>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#065280]">{titre}</h2>
        <button onClick={() => { setBrouillon(vide); setEdition('nouveau') }}
          className="bg-[#0A69AD] text-white text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {edition !== null && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-xl p-4 mb-5 space-y-3">
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
            <button onClick={() => setEdition(null)} className="text-gray-500 px-4 py-2 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#065280] text-sm truncate">{item[champs[0].cle]}</p>
              {champs[1] && <p className="text-gray-500 text-xs truncate">{String(item[champs[1].cle] || '').slice(0, 80)}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setBrouillon(versBrouillon(item)); setEdition(i) }}
                className="text-[#0A69AD] p-1.5 hover:bg-[#F4F6F8] rounded-lg"><Pencil size={15} /></button>
              <button onClick={() => supprimer(i)}
                className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-400 text-sm text-center py-6">Aucun élément.</p>}
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

  if (chargement) return <p className="text-gray-400 text-sm p-4">Chargement…</p>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#065280]">Formations</h2>
        <button onClick={() => { setBrouillon(vide); setEdition('nouveau') }}
          className="bg-[#0A69AD] text-white text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {edition !== null && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-xl p-4 mb-5 space-y-3">
          {[
            ['titre', 'Titre de la formation'],
            ['accroche', 'Accroche courte'],
            ['places', 'Places disponibles'],
            ['publicVise', 'Public visé'],
          ].map(([cle, label]) => (
            <div key={cle}>
              <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
              <input value={brouillon[cle]} onChange={(e) => setBrouillon({ ...brouillon, [cle]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Sessions (une par ligne)</label>
            <textarea rows={2} value={brouillon.prochainesSessions}
              onChange={(e) => setBrouillon({ ...brouillon, prochainesSessions: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[['tarifEtudiant', 'Tarif Étudiants'], ['tarifSalarie', 'Tarif Salariés'], ['tarifChef', "Tarif Chefs d'ent."]].map(([cle, label]) => (
              <div key={cle}>
                <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
                <input value={brouillon[cle]} onChange={(e) => setBrouillon({ ...brouillon, [cle]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={sauvegarder} className="bg-[#C9A227] text-[#065280] font-bold px-4 py-2 rounded-lg text-sm">Enregistrer</button>
            <button onClick={() => setEdition(null)} className="text-gray-500 px-4 py-2 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#065280] text-sm truncate">{item.titre}</p>
              <p className="text-gray-500 text-xs truncate">{item.accroche}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setBrouillon(versBrouillon(item)); setEdition(i) }}
                className="text-[#0A69AD] p-1.5 hover:bg-[#F4F6F8] rounded-lg"><Pencil size={15} /></button>
              <button onClick={() => supprimer(i)}
                className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// SECTION ÉQUIPE AVEC UPLOAD PHOTO DIRECT
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
    store.getEquipe().then((data) => { if (actif) { setItems(data); setChargement(false) } })
    return () => { actif = false }
  }, [])

  const handlePhotoUpload = async (e) => {
    const fichier = e.target.files[0]
    if (!fichier) return
    setUploading(true)
    try {
      const url = await uploadCloudinary(fichier, 'image')
      setBrouillon(b => ({ ...b, photo: url }))
    } catch (err) { alert('Erreur upload: ' + err.message) }
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

  if (chargement) return <p className="text-gray-400 text-sm p-4">Chargement…</p>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-bold text-[#065280]">Équipe & Photos</h2>
          <p className="text-xs text-gray-500">Uploadez les photos directement depuis votre appareil</p>
        </div>
        <button onClick={() => { setBrouillon(vide); setEdition('nouveau') }}
          className="bg-[#0A69AD] text-white text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {edition !== null && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-xl p-4 mb-5 space-y-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Nom complet *</label>
            <input value={brouillon.nom} onChange={(e) => setBrouillon({ ...brouillon, nom: e.target.value })}
              placeholder="Ex: Boukeu Florian"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Fonction *</label>
            <input value={brouillon.role} onChange={(e) => setBrouillon({ ...brouillon, role: e.target.value })}
              placeholder="Ex: Directeur Général"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-2">Photo</label>
            {brouillon.photo ? (
              <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-green-200 mb-2">
                <img src={brouillon.photo} alt="Aperçu" className="w-14 h-14 rounded-full object-cover border-2 border-[#0A69AD]" />
                <div>
                  <p className="text-xs font-semibold text-green-600">✅ Photo chargée</p>
                  <button onClick={() => setBrouillon(b => ({ ...b, photo: '' }))}
                    className="text-xs text-red-500 hover:underline">Changer la photo</button>
                </div>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer mb-2 transition-colors ${uploading ? 'border-[#0A69AD] bg-blue-50' : 'border-gray-300 hover:border-[#0A69AD] bg-white'}`}>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} className="hidden" />
                {uploading ? (
                  <div className="text-center">
                    <div className="w-5 h-5 border-2 border-[#0A69AD] border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                    <p className="text-xs text-[#0A69AD] font-semibold">Upload en cours…</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl mb-1">📸</p>
                    <p className="text-sm font-semibold text-[#065280]">Choisir depuis l'appareil</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
                  </div>
                )}
              </label>
            )}
            <p className="text-xs text-gray-400 mb-1">Ou coller un lien direct :</p>
            <input value={brouillon.photo} onChange={(e) => setBrouillon({ ...brouillon, photo: e.target.value })}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={sauvegarder} disabled={!brouillon.nom || uploading}
              className="bg-[#C9A227] text-[#065280] font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50">Enregistrer</button>
            <button onClick={() => setEdition(null)} className="text-gray-500 px-4 py-2 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-2 mt-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0A69AD] flex items-center justify-center overflow-hidden shrink-0">
              {item.photo
                ? <img src={item.photo} alt={item.nom} className="w-full h-full object-cover" />
                : <User className="text-white" size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#065280] text-sm truncate">{item.nom}</p>
              <p className="text-gray-500 text-xs">{item.role}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => { setBrouillon({ nom: item.nom || '', role: item.role || '', photo: item.photo || '' }); setEdition(i) }}
                className="text-[#0A69AD] p-1.5 hover:bg-[#F4F6F8] rounded-lg"><Pencil size={15} /></button>
              <button onClick={() => supprimer(i)}
                className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
            <User className="text-[#C9A227] mx-auto mb-2" size={28} />
            <p className="text-gray-400 text-sm">Aucun membre ajouté.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SECTION MÉDIAS — VIDÉO HERO
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
    const fichier = e.target.files[0]
    if (!fichier) return
    setUploading(true); setProgression(0)
    try {
      const url = await uploadCloudinary(fichier, 'video', setProgression)
      const nouveauMedia = { ...media, heroVideoUrl: url }
      setMedia(nouveauMedia)
      await store.setMedia(nouveauMedia)
      setEnregistre(true)
      setTimeout(() => setEnregistre(false), 3000)
    } catch (err) { alert('Erreur: ' + err.message) }
    setUploading(false); setProgression(0)
  }

  const sauvegarderLien = async () => {
    await store.setMedia(media)
    setEnregistre(true)
    setTimeout(() => setEnregistre(false), 2000)
  }

  if (chargement) return <p className="text-gray-400 text-sm p-4">Chargement…</p>

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-lg font-bold text-[#065280] mb-1">Vidéo Hero</h2>
      <p className="text-xs text-gray-500 mb-5">Vidéo affichée en fond sur la page d'accueil.</p>
      <div className="bg-[#F4F6F8] border border-gray-200 rounded-xl p-4 space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">📁 Uploader depuis l'appareil</p>
          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'border-[#0A69AD] bg-blue-50' : 'border-gray-300 hover:border-[#0A69AD] bg-white'}`}>
            <input type="file" accept="video/*" onChange={handleFichier} disabled={uploading} className="hidden" />
            {uploading ? (
              <div className="text-center px-6 w-full">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div className="bg-[#0A69AD] h-3 rounded-full transition-all" style={{ width: `${progression}%` }} />
                </div>
                <p className="text-[#0A69AD] font-semibold text-sm">Upload… {progression}%</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-3xl mb-1">🎬</p>
                <p className="text-sm font-semibold text-[#065280]">Choisir une vidéo</p>
                <p className="text-xs text-gray-400">MP4, MOV — max 100MB</p>
              </div>
            )}
          </label>
        </div>
        {media.heroVideoUrl && media.heroVideoUrl.startsWith('http') && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">✅ Vidéo active</p>
            <video src={media.heroVideoUrl} controls className="w-full rounded-lg max-h-36 object-cover" />
          </div>
        )}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">🔗 Ou coller un lien .mp4</p>
          <div className="flex gap-2">
            <input value={media.heroVideoUrl || ''} onChange={(e) => setMedia({ ...media, heroVideoUrl: e.target.value })}
              placeholder="https://..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white min-w-0" />
            <button onClick={sauvegarderLien} className="bg-[#C9A227] text-[#065280] font-bold px-3 py-2 rounded-lg text-sm shrink-0">
              {enregistre ? '✓' : 'OK'}
            </button>
          </div>
        </div>
        {enregistre && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">✅ Enregistré !</div>}
      </div>
    </div>
  )
}

// ============================================
// SECTION ANNONCES & STATUTS — COMPLÈTE
// ============================================
function SectionAnnonces() {
  const [annonces, setAnnonces] = useState([])
  const [chargement, setChargement] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const vide = { titre: '', contenu: '', type: 'bandeau', image_url: '', date_fin: '', actif: true }
  const [brouillon, setBrouillon] = useState(vide)

  const charger = async () => {
    setChargement(true)
    const data = await store.getAnnonces()
    setAnnonces(data)
    setChargement(false)
  }

  useEffect(() => { charger() }, [])

  const handleImageUpload = async (e) => {
    const fichier = e.target.files[0]
    if (!fichier) return
    setUploading(true)
    try {
      const url = await uploadCloudinary(fichier, 'image')
      setBrouillon(b => ({ ...b, image_url: url }))
    } catch (err) { alert('Erreur: ' + err.message) }
    setUploading(false)
  }

  const sauvegarder = async () => {
    if (!brouillon.titre) { alert('Le titre est obligatoire.'); return }
    const annonce = {
      titre: brouillon.titre,
      contenu: brouillon.contenu || '',
      type: brouillon.type,
      image_url: brouillon.image_url || null,
      actif: brouillon.actif,
      date_fin: brouillon.date_fin ? new Date(brouillon.date_fin).toISOString() : null,
    }
    const result = await store.addAnnonce(annonce)
    if (result) { setBrouillon(vide); setShowForm(false); charger() }
    else alert('Erreur Supabase. Vérifie que la table "annonces" existe.')
  }

  const toggleActif = async (annonce) => {
    await store.updateAnnonce(annonce.id, { actif: !annonce.actif })
    charger()
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer définitivement ?')) return
    await store.deleteAnnonce(id)
    charger()
  }

  const typeBadges = {
    bandeau: { label: '📢 Bandeau', color: 'bg-blue-100 text-blue-700' },
    popup: { label: '🪟 Popup', color: 'bg-purple-100 text-purple-700' },
    statut: { label: '💬 Statut', color: 'bg-green-100 text-green-700' },
    alerte: { label: '🔔 Alerte', color: 'bg-red-100 text-red-700' },
  }

  if (chargement) return <p className="text-gray-400 text-sm p-4">Chargement…</p>

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[#065280]">Annonces & Statuts</h2>
          <p className="text-xs text-gray-500">Publiez des annonces visibles par tous les visiteurs</p>
        </div>
        <button onClick={() => { setBrouillon(vide); setShowForm(true) }}
          className="bg-[#0A69AD] text-white text-sm font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5">
          <Plus size={16} /> Nouvelle
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        {[
          { type: 'bandeau', icon: '📢', desc: 'Texte en haut du site' },
          { type: 'popup', icon: '🪟', desc: 'Fenêtre à l\'arrivée' },
          { type: 'statut', icon: '💬', desc: 'Carte sur l\'accueil' },
          { type: 'alerte', icon: '🔔', desc: 'Alerte urgente rouge' },
        ].map((t) => (
          <div key={t.type} className="bg-white border border-gray-100 rounded-lg p-2 text-center">
            <p className="text-xl">{t.icon}</p>
            <p className="text-xs font-bold text-[#065280] capitalize">{t.type}</p>
            <p className="text-xs text-gray-400 leading-tight">{t.desc}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-[#F4F6F8] border border-gray-200 rounded-xl p-4 mb-5 space-y-3">
          <h3 className="font-bold text-[#065280] text-sm">Nouvelle annonce</h3>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Titre *</label>
            <input value={brouillon.titre} onChange={(e) => setBrouillon({ ...brouillon, titre: e.target.value })}
              placeholder="Ex: Inscriptions ouvertes — Formation Fiscalité 2026"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Message / Détail</label>
            <textarea rows={3} value={brouillon.contenu} onChange={(e) => setBrouillon({ ...brouillon, contenu: e.target.value })}
              placeholder="Informations complémentaires..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Type d'affichage</label>
              <select value={brouillon.type} onChange={(e) => setBrouillon({ ...brouillon, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white">
                <option value="bandeau">📢 Bandeau défilant</option>
                <option value="popup">🪟 Popup accueil</option>
                <option value="statut">💬 Statut accueil</option>
                <option value="alerte">🔔 Alerte urgente</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Expire le</label>
              <input type="datetime-local" value={brouillon.date_fin}
                onChange={(e) => setBrouillon({ ...brouillon, date_fin: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0A69AD] bg-white" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-2">Image (optionnel)</label>
            {brouillon.image_url ? (
              <div className="relative mb-2">
                <img src={brouillon.image_url} alt="" className="w-full h-28 object-cover rounded-lg" />
                <button onClick={() => setBrouillon(b => ({ ...b, image_url: '' }))}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
              </div>
            ) : (
              <label className={`flex items-center justify-center gap-2 h-14 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading ? 'border-[#0A69AD] bg-blue-50' : 'border-gray-300 hover:border-[#0A69AD] bg-white'}`}>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                <span className="text-sm text-gray-600">{uploading ? '⏳ Upload…' : '🖼️ Ajouter une image depuis l\'appareil'}</span>
              </label>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="actif_form" checked={brouillon.actif}
              onChange={(e) => setBrouillon({ ...brouillon, actif: e.target.checked })} className="w-4 h-4 rounded" />
            <label htmlFor="actif_form" className="text-sm text-gray-600 cursor-pointer">Publier immédiatement</label>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={sauvegarder} disabled={!brouillon.titre || uploading}
              className="bg-[#C9A227] text-[#065280] font-bold px-5 py-2 rounded-lg text-sm disabled:opacity-50">Publier</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 px-4 py-2 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {annonces.length === 0 && !showForm && (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
            <p className="text-3xl mb-2">📢</p>
            <p className="text-gray-400 text-sm">Aucune annonce. Créez votre première annonce ci-dessus.</p>
          </div>
        )}
        {annonces.map((annonce) => {
          const badge = typeBadges[annonce.type] || { label: annonce.type, color: 'bg-gray-100 text-gray-700' }
          const expire = annonce.date_fin ? new Date(annonce.date_fin) < new Date() : false
          return (
            <div key={annonce.id} className={`bg-white border rounded-xl p-4 transition-opacity ${!annonce.actif || expire ? 'opacity-60 border-gray-100' : 'border-[#0A69AD]/20'}`}>
              <div className="flex items-start gap-3">
                {annonce.image_url && (
                  <img src={annonce.image_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
                    {expire && <span className="text-xs text-red-500 font-semibold">⏰ Expirée</span>}
                    {!annonce.actif && !expire && <span className="text-xs text-gray-400">⏸ Inactive</span>}
                    {annonce.actif && !expire && <span className="text-xs text-green-600 font-semibold">✅ Active</span>}
                  </div>
                  <p className="font-semibold text-[#065280] text-sm">{annonce.titre}</p>
                  {annonce.contenu && <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{annonce.contenu}</p>}
                  {annonce.date_fin && (
                    <p className="text-xs text-gray-400 mt-1">
                      Expire : {new Date(annonce.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => toggleActif(annonce)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${annonce.actif ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {annonce.actif ? 'Désactiver' : 'Activer'}
                  </button>
                  <button onClick={() => supprimer(annonce.id)}
                    className="text-xs text-red-500 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50">
                    Supprimer
                  </button>
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
// DASHBOARD PRINCIPAL
// ============================================
export default function AdminDashboard() {
  const [actif, setActif] = useState('accueil')
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const auth = sessionStorage.getItem('bksc_admin_auth')
    const timestamp = sessionStorage.getItem('bksc_admin_time')
    if (!auth || !timestamp || Date.now() - parseInt(timestamp) > 4 * 60 * 60 * 1000) {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const deconnexion = () => { clearAdminSession(); navigate('/admin', { replace: true }) }
  const changerSection = (id) => { setActif(id); setMenuMobileOuvert(false) }

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col md:flex-row">

      {/* HEADER MOBILE */}
      <div className="md:hidden bg-[#065280] flex items-center justify-between px-4 py-3 sticky top-0 z-50 shadow-lg">
        <img src="/logo.png" alt="BKSC" className="h-8 bg-white/95 rounded p-1" />
        <div className="flex items-center gap-2">
          <span className="text-[#C9A227] text-xs font-semibold truncate max-w-[120px]">{menu.find(m => m.id === actif)?.label}</span>
          <button onClick={() => setMenuMobileOuvert(!menuMobileOuvert)} className="text-white p-1.5 bg-white/10 rounded-lg">
            {menuMobileOuvert ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE DROPDOWN */}
      {menuMobileOuvert && (
        <div className="md:hidden bg-[#065280] border-t border-white/10 px-3 py-2 flex flex-col gap-1 sticky top-[52px] z-40 shadow-lg">
          {menu.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => changerSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${actif === item.id ? 'bg-[#C9A227] text-[#065280]' : 'text-gray-200 hover:bg-white/10'}`}>
                <Icon size={16} /> {item.label}
              </button>
            )
          })}
          <button onClick={deconnexion} className="flex items-center gap-3 px-4 py-2.5 text-red-300 text-sm mt-1 border-t border-white/10 pt-3">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 bg-[#065280] text-white flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-white/10">
          <img src="/logo.png" alt="BKSC" className="h-10 bg-white/95 rounded p-1" />
          <p className="text-[#C9A227] text-xs font-semibold mt-2">Administration BKSC</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} onClick={() => setActif(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${actif === item.id ? 'bg-[#C9A227] text-[#065280]' : 'text-gray-200 hover:bg-white/10'}`}>
                <Icon size={18} /> {item.label}
              </button>
            )
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <button onClick={deconnexion} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg text-sm">
            <LogOut size={18} /> Déconnexion
          </button>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/5">
            ← Voir le site public
          </Link>
        </div>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 overflow-y-auto">
        {actif === 'accueil' && (
          <div className="p-4 md:p-8">
            <h1 className="text-xl md:text-2xl font-black text-[#065280] mb-1">Tableau de bord</h1>
            <p className="text-gray-500 text-sm mb-6">BK SUCCESS CONSULTING — Administration</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Annonces', icon: '📢', id: 'annonces' },
                { label: 'Services', icon: '⚙️', id: 'services' },
                { label: 'Formations', icon: '🎓', id: 'formations' },
                { label: 'Équipe', icon: '👥', id: 'equipe' },
                { label: 'Témoignages', icon: '💬', id: 'temoignages' },
                { label: 'Vidéo Hero', icon: '🎬', id: 'medias' },
              ].map((c) => (
                <button key={c.id} onClick={() => changerSection(c.id)}
                  className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:shadow-md hover:border-[#0A69AD]/30 transition-all">
                  <p className="text-2xl mb-1">{c.icon}</p>
                  <p className="text-xs font-semibold text-[#065280]">{c.label}</p>
                </button>
              ))}
            </div>
            <div className="bg-green-50 border border-green-200 text-green-800 text-xs md:text-sm rounded-xl p-4">
              ✅ Connecté à Supabase — vos modifications sont visibles par tous les visiteurs du site.
            </div>
          </div>
        )}
        {actif === 'annonces' && <SectionAnnonces />}
        {actif === 'services' && (
          <SectionListe titre="Services" getter={store.getServices} setter={store.setServices}
            champs={[
              { cle: 'titre', label: 'Titre du service' },
              { cle: 'accroche', label: 'Accroche courte' },
              { cle: 'items', label: 'Prestations (une par ligne)', type: 'textarea', isArray: true },
            ]} />
        )}
        {actif === 'formations' && <SectionFormations />}
        {actif === 'equipe' && <SectionEquipe />}
        {actif === 'temoignages' && (
          <SectionListe titre="Témoignages" getter={store.getTemoignages} setter={store.setTemoignages}
            champs={[
              { cle: 'nom', label: 'Nom du client' },
              { cle: 'entreprise', label: 'Entreprise / Organisation' },
              { cle: 'texte', label: 'Témoignage complet', type: 'textarea' },
            ]} />
        )}
        {actif === 'medias' && <SectionMedias />}
        {actif === 'messages' && (
          <div className="p-4 md:p-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-3xl mb-3">📥</p>
              <p className="text-gray-400 text-sm">Les messages du formulaire de contact apparaîtront ici prochainement.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}