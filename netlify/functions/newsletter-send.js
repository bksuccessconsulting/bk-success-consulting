// Envoie un email à tous les abonnés newsletter quand un nouvel article
// est publié. Déclenché depuis l'admin (AdminDashboard.jsx) au moment
// exact où un article passe de "non publié" à "publié".

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ccdvmzzmsnnneinbhkry.supabase.co',
  'sb_publishable_FK2RJWYDvlZLwcWojb4Kyw_PSK6hzNq'
)

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function getHTMLEmail({ titre, extrait, image_url, nomAbonne }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:30px 10px;">
    <table width="600" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">

      <tr><td style="background:linear-gradient(135deg,#065280,#0A69AD);padding:40px 30px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:22px;font-weight:900;">BK SUCCESS CONSULTING</h1>
        <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;">Nouvel article sur notre blog</p>
      </td></tr>

      <tr><td style="padding:30px 30px 10px;">
        <p style="color:#555;margin:0 0 20px;">Bonjour${nomAbonne ? ' ' + nomAbonne : ''},</p>
        <p style="color:#555;line-height:1.6;margin:0 0 20px;">Un nouvel article vient d'être publié sur le blog de BK Success Consulting :</p>
      </td></tr>

      ${image_url ? `<tr><td style="padding:0 30px 20px;"><img src="${image_url}" alt="" style="width:100%;border-radius:12px;display:block;" /></td></tr>` : ''}

      <tr><td style="padding:0 30px 20px;">
        <h2 style="color:#065280;margin:0 0 10px;font-size:20px;">${titre}</h2>
        ${extrait ? `<p style="color:#666;line-height:1.6;margin:0;">${extrait}</p>` : ''}
      </td></tr>

      <tr><td style="padding:0 30px 35px;text-align:center;">
        <a href="https://bks-conseil.com/blog" style="display:inline-block;background:#C9A227;color:#065280;font-weight:900;padding:14px 30px;border-radius:10px;text-decoration:none;">Lire l'article complet</a>
      </td></tr>

      <tr><td style="background:#065280;padding:20px 30px;text-align:center;">
        <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:0;">BK Success Consulting SARL — Ndogbong, ancien dépôt Guinness, Douala</p>
        <p style="color:rgba(255,255,255,0.4);font-size:10px;margin:8px 0 0;">Vous recevez cet email car vous êtes abonné(e) à notre newsletter.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { titre, extrait, image_url } = JSON.parse(event.body || '{}')
    if (!titre) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'titre requis' }) }
    }

    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) {
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Clé Brevo non configurée côté serveur' }) }
    }

    const { data: abonnes, error } = await supabase.from('abonnes').select('email, nom')
    if (error) throw error
    if (!abonnes || abonnes.length === 0) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ envoyes: 0, message: 'Aucun abonné' }) }
    }

    let envoyes = 0
    let echecs = 0

    // Envoi individuel à chaque abonné (respecte leur confidentialité —
    // personne ne voit la liste des autres abonnés dans l'email reçu)
    for (const abonne of abonnes) {
      try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            sender: { name: 'BK Success Consulting', email: 'contact@bks-conseil.com' },
            to: [{ email: abonne.email, name: abonne.nom || undefined }],
            subject: `Nouvel article : ${titre}`,
            htmlContent: getHTMLEmail({ titre, extrait, image_url, nomAbonne: abonne.nom }),
          }),
        })
        if (res.ok) envoyes++
        else echecs++
      } catch (e) {
        echecs++
      }
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ envoyes, echecs, total: abonnes.length }),
    }
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) }
  }
}
