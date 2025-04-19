// AIzaSyAVxn1BI59-6n5eiP1tTyuC1nneb86vk0o
// AIzaSyCl6XTjhcwD6j7KzgDVcWCKmmv3Men5n08
// AIzaSyAiTdonfdh-EcwpbVtfDDpLgZbWz0WEWAo new

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

// Gemini API key
const genAI = new GoogleGenerativeAI("AIzaSyAiTdonfdh-EcwpbVtfDDpLgZbWz0WEWAo");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/analyze', async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ analysis: 'Question and answer are required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-exp-03-25' });

    const prompt = `You are an expert career coach and hiring manager. I will give you an interview question and a candidate's answer. I want you to evaluate the answer with a detailed, creative, and constructive feedback.

Analyze the structure, clarity, and relevance of the response.

Comment on the candidate’s communication skills, critical thinking, and domain knowledge.

Provide suggestions to improve the answer.

Give a sample how should the answer look like.

If suitable, include a short 1–2 sentence summary praising what was good in the answer.

Here is the question and answer:

Question: ${question}
Answer: ${answer}
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
