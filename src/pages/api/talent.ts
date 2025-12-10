// API route to proxy Talent Protocol API calls (protects API key)
import type { NextApiRequest, NextApiResponse } from 'next';

const TALENT_API_KEY = process.env.TALENT_API_KEY;
const TALENT_API_BASE = 'https://api.talentprotocol.com/api/v2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!TALENT_API_KEY) {
    return res.status(500).json({ error: 'Talent API key not configured' });
  }

  const { endpoint, ...params } = req.query;
  
  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  try {
    // Build URL with query params
    const url = new URL(`${TALENT_API_BASE}/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'X-API-KEY': TALENT_API_KEY,
        'Content-Type': 'application/json',
      },
      ...(req.method === 'POST' && req.body ? { body: JSON.stringify(req.body) } : {}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Talent API error: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Talent API proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
