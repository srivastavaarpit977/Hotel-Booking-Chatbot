require('dotenv').config();
const express = require('express');
const { Conversation } = require('./database');
const { chatbotResponse } = require('./chatbot');

const app = express();
app.use(express.json());

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    let conversation = await Conversation.findOne({ where: { userId } });
    if (!conversation) {
      conversation = await Conversation.create({ userId, messages: '[]' });
    }

    const history = JSON.parse(conversation.messages);
    const response = await chatbotResponse(message, history);

    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: response });

    await conversation.update({ messages: JSON.stringify(history) });

    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const PORT = process.env.PORT || 9050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));