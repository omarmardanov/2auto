export default async function handler(req, res) {
  try {
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
              content: `
You are a deterministic automotive query parser.

TASK:
Parse a car parts search query and extract structured vehicle data.

STRICT RULES:
- Always return valid JSON
- Do NOT add explanations
- Do NOT omit fields
- If a value is clearly mentioned, you MUST extract it
- If not mentioned, return null
- Normalize all values to canonical English

NORMALIZATION RULES:
- Brand names must be canonical (KIA, Hyundai, Toyota, Lada, etc.)
- Model names must be canonical (K5, Granta, Camry, etc.)
- Transmission:
  "автомат", "automatic", "AT" → "automatic"
  "механика", "manual", "MT" → "manual"
- Fuel:
  "бензин", "petrol", "gasoline" → "petrol"
  "дизель", "diesel" → "diesel"
- Engine volume:
  "2.0", "2л", "2 литра" → "2.0"

OUTPUT FORMAT (EXACT KEYS):
{
  "brand": string | null,
  "model": string | null,
  "year": number | null,
  "engine_volume": string | null,
  "fuel": string | null,
  "transmission": string | null,
  "part_type": string | null
}

IMPORTANT:
If the query contains a short or ambiguous model (e.g. "K5"),
assume it is a valid model if brand is present.
`
            },
            {
              role: 'user',
              content: query
            }
          ]
        })
      }
    );

    const data = await response.json();

    res.status(200).json(
      JSON.parse(data.choices[0].message.content)
    );

  } catch (err) {
    res.status(500).json({
      error: 'Parsing failed',
      details: err.message
    });
  }
}

