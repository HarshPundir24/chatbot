import axios from 'axios';

const url = 'https://api.cohere.ai/generate';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, consent } = req.body;
  const apiKey = process.env.cohere_api_key;

  // Function to determine if the question is fishing-related
  const isFishingQuestion = (question) => {
    const fishingKeywords = [
      'fishing', 'bait', 'lure', 'rod', 'reel', 'catch', 'fishing trip','type',
      'fishing gear', 'angler', 'fly fishing', 'deep sea fishing', 
      'fishing techniques', 'fishing spots', 'fishing regulations', 
      'tackle', 'fishing boat', 'fishing license', 'fishing season', 
      'fishing tips', 'fishing knots', 'fishing line', 'fishing tackle', 
      'saltwater fishing', 'freshwater fishing', 'fishing guide', 
      'fish species', 'fishing reports', 'ice fishing', 'shore fishing',
      'casting', 'casting accuracy', 'trout', 'salmon', 'bass', 
      'catfish', 'perch', 'walleye', 'pike', 'carp', 'crappie', 
      'mackerel', 'marlin', 'swordfish', 'tuna', 'fishing bait', 
      'live bait', 'artificial bait', 'jig', 'spinner', 'spoon', 
      'crankbait', 'swimbait', 'topwater', 'chumming', 'drift fishing', 
      'bottom fishing', 'trolling', 'jigging', 'surf fishing', 'pier fishing', 
      'kayak fishing', 'boat fishing', 'ice auger', 'fish finder', 
      'fishing rod holder', 'fishing net', 'fishing waders', 'fishing vest', 
      'catch and release', 'barbless hooks', 'fishing charter', 'fishing lodge','fish'
    ];
    return fishingKeywords.some(keyword => question.toLowerCase().includes(keyword));
  };

  const isGreeting = (question) => {
    const greetings = ['hello', 'hi', 'how are you', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => question.toLowerCase().includes(greeting));
  };

  if (isGreeting(question)) {
    return res.status(200).json({ response: 'Hello! How can I assist you with fishing today?' });
  }

  if (!isFishingQuestion(question)) {
    return res.status(200).json({ response: 'I am a fishing chatbot and I can give answers related to fishing topics.' });
  }

  try {
    const response = await axios.post(
      url,
      {
        prompt: question,
        max_tokens: 300,
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
