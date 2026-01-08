export default async function handler(req, res) {
  const { query } = req.body;

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
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

EXAMPLES:

INPUT: масляный фильтр KIA K5 2024 2.0 автомат
OUTPUT:
{
  "brand": "KIA",
  "model": "K5",
  "year": 2024,
  "engine_volume": "2.0",
  "fuel": null,
  "transmission": "automatic",
  "part_type": "oil filter"
}

INPUT: масляный фильтр лада гранта
OUTPUT:
{
  "brand": "Lada",
  "model": "Granta",
  "year": null,
  "engine_volume": null,
  "fuel": null,
  "transmission": null,
  "part_type": "oil filter"
}
`
}
  );

  const data = await response.json();
  res.status(200).json(JSON.parse(data.choices[0].message.content));
}
