const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyCl6XTjhcwD6j7KzgDVcWCKmmv3Men5n08");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/analyze', async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ analysis: 'Question and answer are required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-exp-03-25' });

    const prompt = `
You are an expert interview evaluator. A candidate was asked the following question:

**Question:** ${question}

The candidate responded with:

**Answer:** ${answer}

Please analyze this answer and give constructive feedback, including strengths, weaknesses, and suggestions for improvement.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ analysis: text });
  } catch (error) {
    console.error('Error with Gemini API:', error);
    res.status(500).json({ analysis: 'Error generating feedback.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
