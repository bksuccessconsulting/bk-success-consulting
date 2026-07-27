const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const NIVEAUX = {
  90: { label: 'Expert', emoji: '👑', couleur: '#C9A227', conseil: 'Vous maîtrisez parfaitement ce domaine. BK Success Consulting peut vous accompagner pour aller encore plus loin avec un audit stratégique personnalisé.' },
  75: { label: 'Excellent', emoji: '🏆', couleur: '#25D366', conseil: 'Très bonne maîtrise ! Quelques points peuvent encore être optimisés. Nos experts peuvent vous aider à perfectionner votre gestion.' },
  60: { label: 'Bien', emoji: '⭐', couleur: '#0A69AD', conseil: 'Bonne base ! Des lacunes existent encore. Une formation ou un accompagnement BKSC vous permettrait de progresser rapidement.' },
  40: { label: 'Passable', emoji: '📚', couleur: '#f59e0b', conseil: 'Des connaissances à renforcer. Nos formations certifiantes sont spécialement conçues pour vous amener au niveau professionnel.' },
  0:  { label: 'Débutant', emoji: '💪', couleur: '#ef4444', conseil: 'Ne vous découragez pas ! BK Success Consulting vous propose un accompagnement complet depuis les bases jusqu\'à la maîtrise totale.' },
}

function getNiveau(pct) {
  if (pct >= 90) return NIVEAUX[90]
  if (pct >= 75) return NIVEAUX[75]
  if (pct >= 60) return NIVEAUX[60]
  if (pct >= 40) return NIVEAUX[40]
  return NIVEAUX[0]
}

function getHTMLEmailVisiteur({ nom, score, total, pct, niveau, categorie }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:30px 10px;">
    <table width="600" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
      
      <!-- HEADER -->
      <tr><td style="background:linear-gradient(135deg,#065280,#0A69AD);padding:40px 30px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;font-weight:900;">BK SUCCESS CONSULTING</h1>
        <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:13px;">Cabinet Comptable & Fiscal — Douala, Cameroun</p>
      </td></tr>

      <!-- BONJOUR -->
      <tr><td style="padding:30px 30px 20px;">
        <h2 style="color:#065280;margin:0 0 10px;">Bonjour ${nom} ! 👋</h2>
        <p style="color:#555;line-height:1.6;margin:0;">Merci d'avoir complété notre quiz <strong>${categorie}</strong>. Voici votre résultat personnalisé.</p>
      </td></tr>

      <!-- SCORE -->
      <tr><td style="padding:0 30px 20px;">
        <div style="background:linear-gradient(135deg,#065280,#0A69AD);border-radius:16px;padding:30px;text-align:center;">
          <div style="font-size:64px;margin-bottom:10px;">${niveau.emoji}</div>
          <div style="font-size:48px;font-weight:900;color:#C9A227;margin-bottom:5px;">${pct}%</div>
          <div style="font-size:22px;font-weight:900;color:white;margin-bottom:5px;">${niveau.label}</div>
          <div style="color:rgba(255,255,255,0.7);font-size:14px;">${score} / ${total} bonnes réponses</div>
        </div>
      </td></tr>

      <!-- ANALYSE -->
      <tr><td style="padding:0 30px 20px;">
        <h3 style="color:#065280;margin:0 0 12px;">📊 Notre analyse</h3>
        <div style="background:#F4F6F8;border-radius:12px;padding:20px;border-left:4px solid #C9A227;">
          <p style="color:#555;line-height:1.7;margin:0;">${niveau.conseil}</p>
        </div>
      </td></tr>

      <!-- RECOMMANDATION -->
      <tr><td style="padding:0 30px 20px;">
        <h3 style="color:#065280;margin:0 0 12px;">💡 Ce que nous vous recommandons</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${pct < 75 ? `
          <tr><td style="padding:8px 0;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="color:#C9A227;font-size:18px;">🎓</span>
              <span style="color:#555;font-size:14px;">Nos <strong>formations certifiantes</strong> commencent à 110 000 FCFA</span>
            </div>
          </td></tr>` : ''}
          <tr><td style="padding:8px 0;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="color:#C9A227;font-size:18px;">📞</span>
              <span style="color:#555;font-size:14px;">Consultation gratuite avec nos experts : <strong>+237 657 37 89 27</strong></span>
            </div>
          </td></tr>
          <tr><td style="padding:8px 0;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="color:#C9A227;font-size:18px;">🌐</span>
              <span style="color:#555;font-size:14px;">Visitez notre site : <strong>bks-conseil.com</strong></span>
            </div>
          </td></tr>
        </table>
      </td></tr>

      <!-- BOUTON RDV -->
      <tr><td style="padding:0 30px 30px;text-align:center;">
        <a href="https://wa.me/237657378927?text=Bonjour%2C%20j%27ai%20fait%20le%20quiz%20${encodeURIComponent(categorie)}%20et%20j%27aimerais%20prendre%20rendez-vous."
           style="display:inline-block;background:#25D366;color:white;font-weight:900;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:15px;margin-bottom:15px;">
          📅 Prendre rendez-vous
        </a>
        <br>
        <a href="mailto:contact@bks-conseil.com"
           style="display:inline-block;background:#065280;color:white;font-weight:900;text-decoration:none;padding:16px 40px;border-radius:12px;font-size:15px;">
          ✉️ Répondre par email
        </a>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#F4F6F8;padding:20px 30px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="color:#999;font-size:12px;margin:0;">BK Success Consulting SARL · Ndogbong Citadelle, Douala</p>
        <p style="color:#999;font-size:12px;margin:5px 0 0;">RCCM RC/DLN/2019/B/1069 · +237 657 37 89 27</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

function getHTMLEmailCabinet({ nom, email, telephone, entreprise, categorie, score, total, pct, niveau, reponses }) {
  const lignesReponses = reponses.map((r, i) =>
    `<tr style="background:${i % 2 === 0 ? '#F4F6F8' : 'white'};">
      <td style="padding:8px 12px;color:#555;font-size:13px;">${r.question}</td>
      <td style="padding:8px 12px;font-weight:bold;color:${r.correct ? '#25D366' : '#ef4444'};font-size:13px;">
        ${r.correct ? '✅' : '❌'} ${r.reponseChoisie}
      </td>
    </tr>`
  ).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F4F6F8;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center" style="padding:30px 10px;">
    <table width="600" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
      
      <tr><td style="background:linear-gradient(135deg,#C9A227,#b8932a);padding:25px 30px;">
        <h1 style="color:#065280;margin:0;font-size:20px;font-weight:900;">🔔 Nouveau Prospect — ${niveau.emoji} ${niveau.label}</h1>
        <p style="color:#065280;margin:5px 0 0;opacity:0.8;font-size:13px;">${new Date().toLocaleString('fr-FR')}</p>
      </td></tr>

      <tr><td style="padding:25px 30px;">
        <h3 style="color:#065280;margin:0 0 15px;font-size:16px;">👤 Informations du prospect</h3>
        <table width="100%" cellpadding="0" cellspacing="4">
          <tr><td style="color:#999;font-size:13px;width:140px;">Nom :</td><td style="color:#065280;font-weight:bold;font-size:13px;">${nom}</td></tr>
          <tr><td style="color:#999;font-size:13px;">Email :</td><td style="color:#065280;font-weight:bold;font-size:13px;">${email}</td></tr>
          <tr><td style="color:#999;font-size:13px;">Téléphone :</td><td style="color:#065280;font-weight:bold;font-size:13px;">${telephone || 'Non renseigné'}</td></tr>
          <tr><td style="color:#999;font-size:13px;">Entreprise :</td><td style="color:#065280;font-weight:bold;font-size:13px;">${entreprise || 'Non renseignée'}</td></tr>
          <tr><td style="color:#999;font-size:13px;">Catégorie :</td><td style="color:#065280;font-weight:bold;font-size:13px;">${categorie}</td></tr>
        </table>

        <div style="background:linear-gradient(135deg,#065280,#0A69AD);border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
          <div style="font-size:36px;font-weight:900;color:#C9A227;">${pct}% — ${niveau.label} ${niveau.emoji}</div>
          <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:5px;">${score} / ${total} bonnes réponses</div>
        </div>

        <h3 style="color:#065280;margin:0 0 10px;font-size:16px;">📋 Détail des réponses</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr style="background:#065280;">
            <th style="padding:10px 12px;color:white;text-align:left;font-size:12px;">Question</th>
            <th style="padding:10px 12px;color:white;text-align:left;font-size:12px;">Réponse</th>
          </tr>
          ${lignesReponses}
        </table>

        <div style="margin-top:20px;text-align:center;">
          <a href="https://wa.me/${telephone ? telephone.replace(/\D/g,'') : '237657378927'}"
             style="display:inline-block;background:#25D366;color:white;font-weight:900;text-decoration:none;padding:14px 30px;border-radius:10px;font-size:14px;margin-right:10px;">
            Contacter sur WhatsApp
          </a>
          <a href="mailto:${email}?subject=Suite à votre quiz BKSC"
             style="display:inline-block;background:#065280;color:white;font-weight:900;text-decoration:none;padding:14px 30px;border-radius:10px;font-size:14px;">
            Envoyer un email
          </a>
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Méthode non autorisée' }) }

  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Clé Brevo manquante' }) }

  try {
    const body = JSON.parse(event.body || '{}')
    const { nom, email, telephone, entreprise, categorie, score, total, reponses } = body

    const pct = Math.round((score / total) * 100)
    const niveau = getNiveau(pct)
    const tagBrevo = `Quiz-${niveau.label}-${categorie}`

    const reponsesFormatees = (reponses || []).map(r => ({
      question: r.question?.question || '',
      reponseChoisie: r.question?.options?.[r.choisie] || 'Sans réponse',
      correct: r.choisie === r.question?.reponse,
    }))

    // 1. Email au VISITEUR
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'BK Success Consulting', email: 'contact@bks-conseil.com' },
        to: [{ email, name: nom }],
        replyTo: { email: 'contact@bks-conseil.com', name: 'BK Success Consulting' },
        subject: `${niveau.emoji} Votre résultat quiz ${categorie} — ${niveau.label} (${pct}%)`,
        htmlContent: getHTMLEmailVisiteur({ nom, score, total, pct, niveau, categorie }),
      })
    })

    // 2. Email NOTIFICATION au cabinet
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'BK Success Consulting', email: 'contact@bks-conseil.com' },
        to: [{ email: 'contact@bks-conseil.com', name: 'Cabinet BKSC' }],
        subject: `🔔 Nouveau prospect Quiz — ${nom} — ${niveau.emoji} ${niveau.label} (${pct}%)`,
        htmlContent: getHTMLEmailCabinet({ nom, email, telephone, entreprise, categorie, score, total, pct, niveau, reponses: reponsesFormatees }),
      })
    })

    // 3. Créer contact dans Brevo avec TAG
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: nom.split(' ')[0] || nom,
          LASTNAME: nom.split(' ').slice(1).join(' ') || '',
          SMS: telephone || '',
          COMPANY: entreprise || '',
        },
        listIds: [],
        updateEnabled: true,
        tags: [tagBrevo, 'Quiz-BKSC', categorie],
      })
    })

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        succes: true,
        niveau: niveau.label,
        emoji: niveau.emoji,
        pct,
        tagBrevo,
      })
    }

  } catch (err) {
    console.error('Erreur brevo-quiz:', err.message)
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: 'Erreur serveur: ' + err.message })
    }
  }
}