export default async function handler(req, res) {
  const { query } = req.body;

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
`You are a parsing API.
Extract structured data from a car parts query.
Return ONLY valid JSON.

Allowed keys:
brand, model, year, engine_volume, fuel, transmission, part_type.

Values must be canonical English.
If missing, return null.`
          },
          { role: 'user', content: query }
        ]
      })
    }
  );

  const data = await response.json();
  res.status(200).json(JSON.parse(data.choices[0].message.content));
}
