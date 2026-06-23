import { supabase } from './supabaseClient'
import {
  services as servicesDefaut,
  formations as formationsDefaut,
  equipe as equipeDefaut,
  temoignages as temoignagesDefaut,
} from './content'

const DEFAUTS = {
  bksc_services: servicesDefaut,
  bksc_formations: formationsDefaut,
  bksc_equipe: equipeDefaut,
  bksc_temoignages: temoignagesDefaut,
  bksc_media: { heroVideoUrl: '' },
}

async function lire(cle) {
  try {
    const { data } = await supabase
      .from('contenu_site').select('valeur').eq('cle', cle).maybeSingle()
    if (data?.valeur) {
      try { localStorage.setItem(cle, JSON.stringify(data.valeur)) } catch {}
      return data.valeur
    }
  } catch {}
  try {
    const local = localStorage.getItem(cle)
    if (local) return JSON.parse(local)
  } catch {}
  return DEFAUTS[cle] ?? null
}

async function ecrire(cle, valeur) {
  try { localStorage.setItem(cle, JSON.stringify(valeur)) } catch {}
  try {
    const { error } = await supabase
      .from('contenu_site')
      .upsert({ cle, valeur, updated_at: new Date().toISOString() })
    if (error) console.error('Supabase:', error.message)
    return !error
  } catch (e) {
    console.error('Supabase:', e.message)
    return false
  }
}

export const store = {
  getServices: () => lire('bksc_services'),
  setServices: (v) => ecrire('bksc_services', v),
  getFormations: () => lire('bksc_formations'),
  setFormations: (v) => ecrire('bksc_formations', v),
  getEquipe: () => lire('bksc_equipe'),
  setEquipe: (v) => ecrire('bksc_equipe', v),
  getTemoignages: () => lire('bksc_temoignages'),
  setTemoignages: (v) => ecrire('bksc_temoignages', v),
  getMedia: () => lire('bksc_media'),
  setMedia: (v) => ecrire('bksc_media', v),

  getAnnonces: async () => {
    try {
      const { data } = await supabase
        .from('annonces').select('*').order('created_at', { ascending: false })
      return data || []
    } catch { return [] }
  },

  getAnnoncesActives: async () => {
    try {
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('annonces').select('*').eq('actif', true)
        .or(`date_fin.is.null,date_fin.gt.${now}`)
        .order('created_at', { ascending: false })
      return data || []
    } catch { return [] }
  },

  addAnnonce: async (annonce) => {
    try {
      const { data, error } = await supabase.from('annonces').insert([annonce]).select()
      return error ? null : data[0]
    } catch { return null }
  },

  updateAnnonce: async (id, updates) => {
    try {
      const { error } = await supabase.from('annonces').update(updates).eq('id', id)
      return !error
    } catch { return false }
  },

  deleteAnnonce: async (id) => {
    try {
      const { error } = await supabase.from('annonces').delete().eq('id', id)
      return !error
    } catch { return false }
  },
}