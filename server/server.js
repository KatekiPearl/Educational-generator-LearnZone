import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/generate', async (req, res) => {
  const { stream, option, search } = req.body;

  const prompt = `Generate educational content for the topic "${option}" in the stream "${stream}". Include these keywords: ${search}.`;

  try {
    const response = await fetch(`${process.env.API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text;
      res.json({ content: text });
    } else {
      res.status(500).json({ error: 'No content returned from Gemini.' });
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to fetch from Gemini API.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
