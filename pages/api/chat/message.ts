import { METHODS } from '@/constants';
import { NextApiResponse } from 'next';

interface RequestParam {
  method: METHODS;
  body: string;
}

export default async function handler(req: RequestParam, res: NextApiResponse) {
  if (req.method !== METHODS.POST) {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const messages = JSON.parse(req.body);
  let response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
      }),
    });
  } catch (error) {
    console.error('Error:', error);
    return res.json({ error: 'An error occurred' });
  }

  try {
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.json({ error: 'An error occurred' });
  }
}
