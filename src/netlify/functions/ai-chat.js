// Backend sécurisé — clé API jamais exposée côté client
const SYSTEM_PROMPT = `Tu es l'assistant IA officiel de BK SUCCESS CONSULTING SARL, 
cabinet comptable et de conseil basé à Douala, Cameroun.

INFORMATIONS CABINET :
- Nom : BK SUCCESS CONSULTING SARL
- Adresse : Ndogbong Citadelle, Douala (100m de IPH)
- Téléphone : +237 657 37 89 27 / +237 673 40 92 31
- WhatsApp : +237 657 37 89 27
- Email : bksuccessconsulting@gmail.com
- RCCM : RC/DLN/2019/B/1069 | NIU : M051912785954F
- Fondé en 2019 | SARL Droit OHADA
- Horaires : Lun-Ven 08h00-17h00 | Sam 08h00-13h00

SERVICES PROPOSÉS :
1. Comptabilité SYSCOHADA révisé (états financiers, bilan, rapprochement bancaire)
2. Fiscalité & Déclarations (TVA 19,25%, IS, DSF, patentes, DGI)
3. Social & Paie (CNPS, bulletins de salaire, DIPE, IRPP)
4. Juridique & Structuration (création entreprise CFCE, statuts OHADA, AGO/AGE)
5. Audit & Contrôle de gestion (tableaux de bord, KPIs, analyse financière)
6. Conseil en gestion (budget, optimisation fiscale, business plan, financement)

FORMATIONS CERTIFIANTES (Attestation BKSC avec mention) :
- Module 1 : Comptabilité Pratique OHADA → Sessions : janv & juil
- Module 2 : Fiscalité PME & DSF Pratique → Sessions : avr & oct
- Module 3 : Création d'Entreprise / CNPS / Paie → Session : juil
- Module 4 : Audit Interne & Outils Numériques → Session : oct
Tarifs : Étudiants 110 000 | Salariés 150 000 | Chefs d'entreprise 200 000 FCFA
Frais inscription : 10 000 FCFA | Durée : 3 mois / 240h | 10 places max

CONNAISSANCES FISCALES CAMEROUN :
- TVA : 19,25% - déclaration mensuelle sur portail DGI
- IS : acomptes mensuels, taux standard 33%
- DSF : Déclaration Statistique et Fiscale annuelle (CF1, CF2, annexes)
- Patente : impôt professionnel annuel
- CNPS : cotisation employeur 16,2% + salarié 4,2% du salaire brut
- IRPP : retenu à la source sur salaires
- Création SARL : capital minimum 1 000 000 FCFA, dossier CFCE complet

TON RÔLE :
- Répondre aux questions sur la fiscalité et comptabilité camerounaise
- Expliquer les démarches de création d'entreprise au Cameroun
- Présenter les services et formations de BKSC
- Donner des estimations simples (TVA, salaire brut/net, CNPS)
- Pour devis ou consultations → inviter à contacter WhatsApp +237 657 37 89 27

RÈGLES ABSOLUES :
- Toujours répondre en français (sauf si l'utilisateur écrit en anglais)
- Être professionnel, précis et rassurant
- Réponses courtes et claires (max 150 mots)
- Pour toute demande complexe → suggérer une consultation au cabinet
- Ne jamais inventer des informations fiscales non vérifiées`

// Rate limiting anti-spam (8 requêtes/minute/IP maximum)
const compteurs = new Map()

function verifierLimite(ip) {
  const maintenant = Date.now()
  const fenetre = 60 * 1000
  const cle = `${ip}:${Math.floor(maintenant / fenetre)}`
  const count = (compteurs.get(cle) || 0) + 1
  compteurs.set(cle, count)
  if (compteurs.size > 500) {
    const ancienne = `${ip}:${Math.floor((maintenant - fenetre) / fenetre)}`
    compteurs.delete(ancienne)
  }
  return count > 8
}

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    }
  }

  // Vérification rate limiting
  const ip = event.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || event.headers['client-ip']
    || 'unknown'

  if (verifierLimite(ip)) {
    return {
      statusCode: 429,
      headers: CORS,
      body: JSON.stringify({
        error: 'Trop de questions envoyées. Attendez 1 minute.'
      })
    }
  }

  // Vérification clé API
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY manquante')
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Configuration serveur incomplète' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const messages = body.messages || []

    if (!messages.length) {
      return {
        statusCode: 400,
        headers: CORS,
        body: JSON.stringify({ error: 'Message vide' })
      }
    }

    // Garder seulement les 10 derniers messages (économie de tokens)
    const messagesRecents = messages.slice(-10)

    // Construire l'historique pour Gemini
    const contenu = messagesRecents.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    // Appel API Gemini (gratuit - gemini-1.5-flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    const reponseAPI = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contenu,
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.7,
        }
      })
    })

    if (!reponseAPI.ok) {
      const errTexte = await reponseAPI.text()
      console.error('Erreur Gemini API:', reponseAPI.status, errTexte)
      return {
        statusCode: 502,
        headers: CORS,
        body: JSON.stringify({
          error: 'Service IA temporairement indisponible. Contactez-nous sur WhatsApp.'
        })
      }
    }

    const donnees = await reponseAPI.json()
    const texte = donnees.candidates?.[0]?.content?.parts?.[0]?.text

    if (!texte) {
      return {
        statusCode: 500,
        headers: CORS,
        body: JSON.stringify({
          error: 'Réponse vide du service IA. Réessayez.'
        })
      }
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ reponse: texte })
    }

  } catch (err) {
    console.error('Erreur fonction ai-chat:', err.message)
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({
        error: 'Erreur serveur. Contactez-nous sur WhatsApp.'
      })
    }
  }
}