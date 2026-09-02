import { supabase } from './supabaseClient'
import {
  services as servicesDefaut,
  formations as formationsDefaut,
  equipe as equipeDefaut,
  temoignages as temoignagesDefaut,
  cabinetInfo,
  reseauxSociaux,
} from './content'

const DEFAUTS = {
  bksc_services: servicesDefaut,
  bksc_formations: formationsDefaut,
  bksc_equipe: equipeDefaut,
  bksc_temoignages: temoignagesDefaut,
  bksc_media: { heroVideoUrl: '' },
  bksc_galerie: [],
  bksc_settings: {
    telephonePrincipal: cabinetInfo.telephonePrincipal,
    telephoneSecondaire: cabinetInfo.telephoneSecondaire,
    whatsapp: cabinetInfo.whatsapp,
    email: cabinetInfo.email,
    adresse: cabinetInfo.adresse,
    facebook: reseauxSociaux.facebook,
    linkedin: reseauxSociaux.linkedin,
    instagram: reseauxSociaux.instagram,
    youtube: reseauxSociaux.youtube,
    tiktok: reseauxSociaux.tiktok,
  },
  bksc_quiz_custom: { ohada: [], fiscalite: [], creation: [], social: [], audit: [] },
bksc_galerie_videos: [],
}

// ============ CRUD JSONB (services, formations, équipe, etc.) ============
async function lire(cle) {
  try {
    const { data, error } = await supabase
      .from('contenu_site').select('valeur').eq('cle', cle).maybeSingle()
    if (!error && data?.valeur) {
      try { localStorage.setItem(cle, JSON.stringify(data.valeur)) } catch {}
      return data.valeur
    }
    if (error) console.warn(`Supabase lecture "${cle}":`, error.message)
  } catch (e) { console.warn(`Supabase "${cle}":`, e.message) }
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
    if (error) { console.error(`Supabase écriture "${cle}":`, error.message); return false }
    return true
  } catch (e) { console.error(`Supabase "${cle}":`, e.message); return false }
}

export const store = {
  // ============ CONTENU JSONB ============
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
  getGalerie: () => lire('bksc_galerie'),
  setGalerie: (v) => ecrire('bksc_galerie', v),
  getSettings: () => lire('bksc_settings'),
  setSettings: (v) => ecrire('bksc_settings', v),
  getQuizCustom: () => lire('bksc_quiz_custom'),
setQuizCustom: (v) => ecrire('bksc_quiz_custom', v),
getGalerieVideos: () => lire('bksc_galerie_videos'),
setGalerieVideos: (v) => ecrire('bksc_galerie_videos', v),

  // ============ ANNONCES ============
  getAnnonces: async () => {
    try {
      const { data, error } = await supabase
        .from('annonces').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (e) { console.warn('Annonces:', e.message); return [] }
  },

  getAnnoncesActives: async () => {
    try {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('annonces').select('*').eq('actif', true)
        .or(`date_fin.is.null,date_fin.gt.${now}`)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (e) { console.warn('Annonces actives:', e.message); return [] }
  },

  addAnnonce: async (annonce) => {
    try {
      const { data, error } = await supabase.from('annonces').insert([annonce]).select()
      if (error) throw error
      return data[0]
    } catch (e) { console.error('Ajout annonce:', e.message); return null }
  },

  updateAnnonce: async (id, updates) => {
    try {
      const { error } = await supabase.from('annonces').update(updates).eq('id', id)
      if (error) throw error
      return true
    } catch (e) { console.error('MAJ annonce:', e.message); return false }
  },

  deleteAnnonce: async (id) => {
    try {
      const { error } = await supabase.from('annonces').delete().eq('id', id)
      if (error) throw error
      return true
    } catch (e) { console.error('Suppression annonce:', e.message); return false }
  },

  // ============ BLOG ============
  getBlogArticles: async (publieSeulement = false) => {
    try {
      let query = supabase.from('blog_articles').select('*').order('created_at', { ascending: false })
      if (publieSeulement) query = query.eq('publie', true)
      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (e) { console.warn('Blog:', e.message); return [] }
  },

  addBlogArticle: async (article) => {
    try {
      const { data, error } = await supabase.from('blog_articles')
        .insert([{ ...article, updated_at: new Date().toISOString() }]).select()
      if (error) throw error
      return data[0]
    } catch (e) { console.error('Ajout article:', e.message); return null }
  },

  updateBlogArticle: async (id, updates) => {
    try {
      const { error } = await supabase.from('blog_articles')
        .update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
      return true
    } catch (e) { console.error('MAJ article:', e.message); return false }
  },

  deleteBlogArticle: async (id) => {
    try {
      const { error } = await supabase.from('blog_articles').delete().eq('id', id)
      if (error) throw error
      return true
    } catch (e) { console.error('Suppression article:', e.message); return false }
  },
  // ============ ABONNÉS NEWSLETTER ============
getAbonnes: async () => {
  try {
    const { data, error } = await supabase
      .from('abonnes').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (e) { console.warn('Abonnés:', e.message); return [] }
},

addAbonne: async (email, nom = '') => {
  try {
    const { data, error } = await supabase
      .from('abonnes').insert([{ email, nom }]).select()
    if (error) {
      if (error.code === '23505') return { succes: false, message: 'Cet email est déjà abonné.' }
      throw error
    }
    return { succes: true, message: 'Abonnement confirmé !' }
  } catch (e) {
    console.error('Abonnement:', e.message)
    return { succes: false, message: 'Erreur. Réessayez.' }
  }
},

deleteAbonne: async (id) => {
  try {
    const { error } = await supabase.from('abonnes').delete().eq('id', id)
    if (error) throw error
    return true
  } catch (e) { return false }
},
// ============ PROSPECTS QUIZ ============
getProspects: async () => {
  try {
    const { data, error } = await supabase
      .from('prospects_quiz')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (e) { console.warn('Prospects:', e.message); return [] }
},

addProspect: async (prospect) => {
  try {
    const { data, error } = await supabase
      .from('prospects_quiz')
      .insert([prospect])
      .select()
    if (error) throw error
    return data[0]
  } catch (e) { console.error('Ajout prospect:', e.message); return null }
},

updateProspectStatut: async (id, statut) => {
  try {
    const { error } = await supabase
      .from('prospects_quiz')
      .update({ statut })
      .eq('id', id)
    if (error) throw error
    return true
  } catch (e) { return false }
},

deleteProspect: async (id) => {
  try {
    const { error } = await supabase
      .from('prospects_quiz')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  } catch (e) { return false }
},

// ============================================
// COMMENTAIRES BLOG
// ============================================

// Récupère les commentaires d'un article. publiesUniquement=true pour
// le site public (n'affiche que les commentaires validés par l'admin).
getCommentaires: async (articleId, publiesUniquement = true) => {
  try {
    let requete = supabase
      .from('blog_commentaires')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true })
    if (publiesUniquement) requete = requete.eq('statut', 'publie')
    const { data, error } = await requete
    if (error) throw error
    return data || []
  } catch (e) { console.error('Chargement commentaires:', e.message); return [] }
},

// Tous les commentaires, toutes catégories, pour la modération admin
getTousCommentaires: async () => {
  try {
    const { data, error } = await supabase
      .from('blog_commentaires')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (e) { console.error('Chargement commentaires admin:', e.message); return [] }
},

addCommentaire: async (commentaire) => {
  try {
    const { data, error } = await supabase
      .from('blog_commentaires')
      .insert([{ ...commentaire, statut: 'en_attente', est_reponse_equipe: false }])
      .select()
    if (error) throw error
    return data[0]
  } catch (e) { console.error('Ajout commentaire:', e.message); return null }
},

// Réponse postée depuis l'admin, marquée visuellement "cabinet"
repondreCommentaire: async (articleId, parentId, message) => {
  try {
    const { data, error } = await supabase
      .from('blog_commentaires')
      .insert([{
        article_id: articleId,
        parent_id: parentId,
        nom: 'BK Success Consulting',
        message,
        statut: 'publie',
        est_reponse_equipe: true,
      }])
      .select()
    if (error) throw error
    return data[0]
  } catch (e) { console.error('Réponse commentaire:', e.message); return null }
},

updateCommentaireStatut: async (id, statut) => {
  try {
    const { error } = await supabase
      .from('blog_commentaires')
      .update({ statut })
      .eq('id', id)
    if (error) throw error
    return true
  } catch (e) { return false }
},

deleteCommentaire: async (id) => {
  try {
    const { error } = await supabase
      .from('blog_commentaires')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  } catch (e) { return false }
},

// Nettoyage automatique : supprime les commentaires de plus de 2 ans.
// Se déclenche silencieusement quand un visiteur charge le blog —
// Supabase (plan gratuit) n'a pas de tâche planifiée native, donc ce
// nettoyage s'appuie sur le trafic naturel du site.
nettoyerVieuxCommentaires: async () => {
  try {
    const deuxAnsAvant = new Date()
    deuxAnsAvant.setFullYear(deuxAnsAvant.getFullYear() - 2)
    await supabase
      .from('blog_commentaires')
      .delete()
      .lt('created_at', deuxAnsAvant.toISOString())
  } catch (e) { /* silencieux : ne doit jamais bloquer l'affichage du site */ }
},
}