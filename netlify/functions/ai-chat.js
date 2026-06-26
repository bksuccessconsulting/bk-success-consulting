const SYSTEM_PROMPT = `Tu es l'assistant IA officiel de BK SUCCESS CONSULTING SARL, cabinet comptable basé à Douala, Cameroun.

CABINET :
- Adresse : Ndogbong Citadelle, Douala (100m de IPH)
- Tél : +237 657 37 89 27 / +237 673 40 92 31
- WhatsApp : +237 657 37 89 27
- Email : bksuccessconsulting@gmail.com
- RCCM : RC/DLN/2019/B/1069 | NIU : M051912785954F
- Fondé en 2019 | SARL Droit OHADA

SERVICES : Comptabilité SYSCOHADA, Fiscalité (TVA 19.25%, IS, DSF), Social & Paie (CNPS), Juridique (création entreprise CFCE), Audit, Conseil en gestion

FORMATIONS (110 000 à 200 000 FCFA, 3 mois, attestation) :
Module 1: Comptabilité OHADA | Module 2: Fiscalité DSF | Module 3: Création entreprise/CNPS | Module 4: Audit numérique

FISCALITÉ CAMEROUN : TVA 19.25% mensuelle DGI, IS 33% acomptes mensuels, DSF annuelle CF1+CF2, CNPS employeur 16.2%+salarié 4.2%, IRPP retenu source

RÈGLES : Réponds en français, max 150 mots, professionnel. Pour devis → WhatsApp +237 657 37 89 27`

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ⚠️ Format CommonJS obligatoire pour Netlify Functions
exports.handler = async function(event, context) {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    }
  }

  // Vérifier la clé API
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY manquante dans les variables Netlify')
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Configuration serveur incomplète. Contactez l\'administrateur.' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const messages = body.messages || []

    if (!messages.length) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Message vide' })
      }
    }

    // Garder max 8 messages pour économiser les tokens
    const recent = messages.slice(-8)

    // Construire l'historique Gemini (user → user, assistant → model)
    const contents = recent.map(function(m) {
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.content || '') }]
      }
    })

    // Appel Gemini 1.5 Flash (gratuit, rapide)
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
          maxOutputTokens: 350,
          temperature: 0.7
        }
      })
    })

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text()
      console.error('Erreur Gemini:', geminiResponse.status, errText)
      return {
        statusCode: 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Service IA indisponible. Contactez-nous sur WhatsApp.' })
      }
    }

    const data = await geminiResponse.json()
    const reponse = data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text

    if (!reponse) {
      console.error('Réponse Gemini vide:', JSON.stringify(data))
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Réponse vide du service IA. Réessayez.' })
      }
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ reponse: reponse })
    }

  } catch (err) {
    console.error('Erreur ai-chat:', err.message)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Erreur serveur. Réessayez ou contactez WhatsApp.' })
    }
  }
}