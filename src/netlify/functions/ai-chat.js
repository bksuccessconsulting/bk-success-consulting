// Backend sécurisé — la clé API est côté serveur, jamais exposée
const SYSTEM_PROMPT = `Tu es l'assistant IA officiel de BK SUCCESS CONSULTING SARL, 
cabinet comptable et de conseil à Douala, Cameroun.

CABINET :
- Nom : BK SUCCESS CONSULTING SARL
- Adresse : Ndogbong Citadelle, Douala (100m de IPH)
- Tél : +237 657 37 89 27 / +237 673 40 92 31
- WhatsApp : +237 657 37 89 27
- Email : bksuccessconsulting@gmail.com
- RCCM : RC/DLN/2019/B/1069 | NIU : M051912785954F
- Fondé en 2019 | SARL Droit OHADA
- Horaires : Lun-Ven 08h-17h | Sam 08h-13h

SERVICES :
1. Comptabilité SYSCOHADA révisé (états financiers, bilan, rapprochement)
2. Fiscalité & Déclarations (TVA 19,25%, IS, DSF, patentes, DGI)
3. Social & Paie (CNPS, bulletins salaire, DIPE, IRPP)
4. Juridique & Structuration (création entreprise CFCE, statuts OHADA, AGO/AGE)
5. Audit & Contrôle de gestion (tableaux bord, KPIs, analyse financière)
6. Conseil en gestion (budget, optimisation fiscale, business plan, financement)

FORMATIONS (à partir de 110 000 FCFA, 3 mois / 240h) :
- Module 1 : Comptabilité Pratique OHADA (janv & juil)
- Module 2 : Fiscalité PME & DSF Pratique (avr & oct)
- Module 3 : Création d'Entreprise / CNPS / Paie (juil)
- Module 4 : Audit Interne & Outils Numériques (oct)
Tarifs : Étudiants 110 000 | Salariés 150 000 | Chefs d'entreprise 200 000 FCFA
+ 10 000 FCFA frais d'inscription | Attestation BKSC avec mention

CONNAISSANCES FISCALES CAMEROUN :
- TVA : taux 19,25%, déclaration mensuelle sur portail DGI
- IS : acomptes mensuels, taux standard 33%
- DSF : Déclaration Statistique et Fiscale annuelle (CF1, CF2, annexes)
- Patente : impôt professionnel annuel
- CNPS : cotisation employeur 16,2% + salarié 4,2% du salaire brut
- IRPP : retenu à la source sur salaires
- Création SARL : capital minimum 1 000 000 FCFA, dossier CFCE

TON RÔLE :
- Répondre questions fiscalité camerounaise et comptabilité OHADA
- Expliquer démarches création d'entreprise au Cameroun
- Présenter services et formations BKSC
- Donner estimations simples (TVA, salaire brut/net, CNPS)
- Pour devis ou rdv complexes → inviter WhatsApp +237 657 37 89 27

RÈGLES :
- Toujours en français (sauf si l'utilisateur écrit en anglais)
- Professionnel, précis, rassurant
- Réponses concises max 180 mots
- Utilise des emojis avec modération
- Si question trop complexe → suggère consultation cabinet`

// Rate limiting simple (en mémoire, par instance de fonction)
const compteurs = new Map()
const LIMITE = 8 // requêtes max par minute par IP
const FENETRE = 60 * 1000

function verifierLimite(ip) {
  const maintenant = Date.now()
  const cle = `${ip}:${Math.floor(maintenant / FENETRE)}`
  const compte = (compteurs.get(cle) || 0) + 1
  compteurs.set(cle, compte)
  // Nettoyage mémoire
  if (compteurs.size > 1000) {
    const ancienne = `${ip}:${Math.floor((maintenant - FENETRE) / FENETRE)}`
    compteurs.delete(ancienne)
  }
  return compte > LIMITE
}

const HEADERS_CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

exports.handler = async (event) => {
  // Gestion CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS_CORS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: HEADERS_CORS, body: JSON.stringify({ error: 'Méthode non autorisée' }) }
  }

  // Rate limiting
  const ip = event.headers['x-forwarded-for']?.split(',')[0] || event.headers['client-ip'] || 'inconnu'
  if (verifierLimite(ip)) {
    return {
      statusCode: 429,
      headers: HEADERS_CORS,
      body: JSON.stringify({ error: 'Trop de questions envoyées. Attendez 1 minute avant de réessayer.' })
    }
  }

  // Vérifier la clé API
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY manquante dans les variables d\'environnement')
    return {
      statusCode: 500,
      headers: HEADERS_CORS,
      body: JSON.stringify({ error: 'Configuration serveur manquante' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const messages = body.messages || []

    if (!Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, headers: HEADERS_CORS, body: JSON.stringify({ error: 'Messages invalides' }) }
    }

    // Limiter l'historique aux 8 derniers messages (contrôle des coûts)
    const messagesRecents = messages.slice(-8)

    const reponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Haiku : 10x moins cher, 2x plus rapide
        max_tokens: 450,
        system: SYSTEM_PROMPT,
        messages: messagesRecents,
      }),
    })

    if (!reponse.ok) {
      const erreurTexte = await reponse.text()
      console.error('Erreur API Anthropic :', reponse.status, erreurTexte)
      return {
        statusCode: 502,
        headers: HEADERS_CORS,
        body: JSON.stringify({ error: 'Erreur du service IA. Contactez-nous sur WhatsApp.' })
      }
    }

    const donnees = await reponse.json()
    const texteReponse = donnees.content?.[0]?.text || 'Je ne peux pas répondre pour le moment.'

    return {
      statusCode: 200,
      headers: HEADERS_CORS,
      body: JSON.stringify({ reponse: texteReponse }),
    }
  } catch (err) {
    console.error('Erreur fonction AI:', err.message)
    return {
      statusCode: 500,
      headers: HEADERS_CORS,
      body: JSON.stringify({ error: 'Erreur serveur. Contactez-nous sur WhatsApp.' })
    }
  }
}