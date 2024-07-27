import axios from 'axios';

const url = 'https://api.cohere.ai/generate';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, consent } = req.body;
  const apiKey = process.env.cohere_api_key;

  try {
    const response = await axios.post(
      url,
      {
        prompt: question,
        max_tokens: 400,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const responseData = response.data.text || 'No response received';

    res.status(200).json({ response: responseData });
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || 'An error occurred' });
  }
}
