import { supabase } from './supabaseClient'
import {
  services as servicesDefaut,
  formations as formationsDefaut,
  equipe as equipeDefaut,
  temoignages as temoignagesDefaut,
} from './content'

const DEFAUTS = {
  services: servicesDefaut,
  formations: formationsDefaut,
  equipe: equipeDefaut,
  temoignages: temoignagesDefaut,
  media: { heroVideoUrl: '' },
}

async function lire(cle) {
  const { data, error } = await supabase.from('contenu_site').select('valeur').eq('cle', cle).maybeSingle()
  if (error || !data) return DEFAUTS[cle]
  return data.valeur
}

async function ecrire(cle, valeur) {
  const { error } = await supabase.from('contenu_site').upsert({ cle, valeur })
  if (error) console.error('Erreur Supabase :', error.message)
  return !error
}

export const store = {
  getServices: () => lire('services'),
  setServices: (v) => ecrire('services', v),

  getFormations: () => lire('formations'),
  setFormations: (v) => ecrire('formations', v),

  getEquipe: () => lire('equipe'),
  setEquipe: (v) => ecrire('equipe', v),

  getTemoignages: () => lire('temoignages'),
  setTemoignages: (v) => ecrire('temoignages', v),

  getMedia: () => lire('media'),
  setMedia: (v) => ecrire('media', v),
}