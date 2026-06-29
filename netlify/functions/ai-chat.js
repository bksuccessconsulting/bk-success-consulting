export async function handler(event) {
  try {
    const { messages } = JSON.parse(event.body)

    const SYSTEM_PROMPT = `
Tu es l'assistant IA officiel de BK SUCCESS CONSULTING SARL.

Tu aides sur :
- comptabilité OHADA
- fiscalité camerounaise
- TVA
- DSF
- CNPS
- création d'entreprise

Réponds toujours en français.
Maximum 150 mots.
Ton professionnel et rassurant.
`

    if (!process.env.VITE_OPENROUTER_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Configuration serveur incomplète. Contactez l’administrateur.',
        }),
      }
    }

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 400,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            data.error?.message ||
            'Erreur OpenRouter',
        }),
      }
    }

    const reply =
      data.choices?.[0]?.message?.content

    return {
      statusCode: 200,
      body: JSON.stringify({
        reponse: reply,
      }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    }
  }
}