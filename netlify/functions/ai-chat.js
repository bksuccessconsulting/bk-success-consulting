// Fonction serveur : le chatbot IA passe désormais par ici au lieu de
// parler directement à OpenRouter depuis le navigateur. La clé API
// (process.env.OPENROUTER_API_KEY) reste ainsi côté serveur, jamais
// visible dans le code envoyé aux visiteurs du site.

const { createClient } = require('@supabase/supabase-js')

// Clé Supabase PUBLIQUE (anon) — normal qu'elle soit ici, c'est la même
// que celle déjà utilisée côté site public, elle n'est pas secrète.
const supabase = createClient(
  'https://ccdvmzzmsnnneinbhkry.supabase.co',
  'sb_publishable_FK2RJWYDvlZLwcWojb4Kyw_PSK6hzNq'
)

const REGLES_STRICTES = `RÈGLES ABSOLUES — À RESPECTER SANS EXCEPTION :

1. Tu réponds UNIQUEMENT à partir des informations fournies dans la section
   "CONTEXTE CABINET" ci-dessous (services, formations, articles publiés,
   coordonnées). Tu n'inventes JAMAIS une information qui n'y figure pas.

2. INTERDICTION FORMELLE DE FAIRE DES CALCULS :
   Tu ne dois JAMAIS calculer un salaire net, une retenue, une cotisation
   CNPS, un montant de TVA, d'IRPP, d'IS ou tout autre montant chiffré,
   même si on te donne un montant de départ (ex: "calcule la retenue sur
   100 000 FCFA"). Les taux fiscaux et sociaux camerounais changent et
   varient selon les cas ; donner un chiffre faux serait dangereux pour
   l'utilisateur. Réponds à la place que ce calcul nécessite une analyse
   personnalisée par un expert du cabinet, et invite au contact WhatsApp.

3. Si une question sort du cadre du cabinet (sujet non couvert par le
   CONTEXTE CABINET, actualité générale, autre pays, question personnelle,
   etc.), dis clairement que tu ne peux pas répondre à cette question et
   invite la personne à contacter le cabinet directement.

4. Ne donne jamais de taux, pourcentage ou barème précis de mémoire. Si un
   taux n'est pas explicitement dans le CONTEXTE CABINET, dis que tu ne
   l'as pas et redirige vers un expert.

5. Réponds TOUJOURS en français (sauf si l'utilisateur écrit en anglais).
6. Ton professionnel, précis, rassurant — maximum 500 mots.
7. Pour devis, RDV, calcul personnalisé ou question hors-sujet → toujours
   inviter à contacter WhatsApp +237 657 37 89 27.
8. developpeur web : YONTA IVAROL (irolivarol@gmail.com)`

async function buildSystemPrompt(langue) {
  let services = []
  let formations = []
  let articles = []

  try {
    const [servicesRes, formationsRes, articlesRes] = await Promise.all([
      supabase.from('contenu_site').select('valeur').eq('cle', 'bksc_services').maybeSingle(),
      supabase.from('contenu_site').select('valeur').eq('cle', 'bksc_formations').maybeSingle(),
      supabase.from('blog_articles').select('titre, contenu, extrait, categorie').eq('publie', true),
    ])
    services = servicesRes.data?.valeur || []
    formations = formationsRes.data?.valeur || []
    articles = articlesRes.data || []
  } catch (e) {
    console.warn('Contexte IA: impossible de charger Supabase', e.message)
  }

  const blocServices = services.length
    ? services.map(s => `- ${s.titre}${s.accroche ? ' : ' + s.accroche : ''}`).join('\n')
    : 'Non renseigné.'

  const blocFormations = formations.length
    ? formations.map(f => {
        const tarifs = Array.isArray(f.tarifs)
          ? f.tarifs.map(t => `${t.segment} ${t.prix}`).join(', ')
          : ''
        return `- ${f.titre}${f.accroche ? ' : ' + f.accroche : ''}${f.duree ? ' (' + f.duree + ')' : ''}${tarifs ? ' — Tarifs : ' + tarifs : ''}`
      }).join('\n')
    : 'Non renseigné.'

  const blocArticles = articles.length
    ? articles.slice(0, 15).map(a => `--- Article : "${a.titre}" (${a.categorie || 'actualité'}) ---\n${(a.contenu || a.extrait || '').slice(0, 1200)}`).join('\n\n')
    : 'Aucun article disponible pour le moment.'

  return `Tu es l'assistant IA officiel de BK SUCCESS CONSULTING SARL, cabinet comptable et de conseil basé à Douala, Cameroun.

INFORMATIONS CABINET :
- Nom : BK SUCCESS CONSULTING SARL
- Adresse : Ndogbong ancien dépot guinness
- Téléphone : +237 657 37 89 27 / +237 673 40 92 31
- WhatsApp : +237 657 37 89 27
- Email : bks-conseil.com
- RCCM : RC/DLN/2019/B/1069 | NIU : M051912785954F
- Fondé en 2019 | SARL Droit OHADA
- Horaires : Lun-Ven 08h-17h | Sam 08h-13h

CONTEXTE CABINET (seule source d'information autorisée pour répondre) :

SERVICES :
${blocServices}

FORMATIONS :
${blocFormations}

ARTICLES PUBLIÉS (actualités, textes de loi, conseils rédigés par le cabinet) :
${blocArticles}

${REGLES_STRICTES}${langue === 'en' ? '\n\nRespond in English.' : ''}`
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { messages, langue } = JSON.parse(event.body || '{}')

    if (!Array.isArray(messages)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'messages requis' }) }
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Clé OpenRouter non configurée côté serveur' }) }
    }

    const systemPrompt = await buildSystemPrompt(langue)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bks-conseil.com',
        'X-Title': 'BK Success Consulting',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.3,
        max_tokens: 400,
      }),
    })

    const data = await response.json()

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) }
  }
}
