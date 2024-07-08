const OpenAI = require('openai');
const axios = require('axios');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function getRooms() {
  const response = await axios.get('https://bot9assignement.deno.dev/rooms');
  return response.data;
}

async function bookRoom(roomId, fullName, email, nights) {
  const response = await axios.post('https://bot9assignement.deno.dev/book', {
    roomId,
    fullName,
    email,
    nights
  });
  return response.data;
}

async function chatbotResponse(message, history) {
  const functions = [
    {
      name: 'get_rooms',
      description: 'Get available hotel rooms',
      parameters: { type: 'object', properties: {} }
    },
    {
      name: 'book_room',
      description: 'Book a hotel room',
      parameters: {
        type: 'object',
        properties: {
          roomId: { type: 'number' },
          fullName: { type: 'string' },
          email: { type: 'string' },
          nights: { type: 'number' }
        },
        required: ['roomId', 'fullName', 'email', 'nights']
      }
    }
  ];

  const messages = [
    { role: 'system', content: 'You are a helpful hotel booking assistant.' },
    ...history,
    { role: 'user', content: message }
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
    functions: functions,
    function_call: 'auto'
  });

  const responseMessage = response.choices[0].message;

  if (responseMessage.function_call) {
    const functionName = responseMessage.function_call.name;
    const functionArgs = JSON.parse(responseMessage.function_call.arguments);

    let functionResult;
    if (functionName === 'get_rooms') {
      functionResult = await getRooms();
    } else if (functionName === 'book_room') {
      functionResult = await bookRoom(
        functionArgs.roomId,
        functionArgs.fullName,
        functionArgs.email,
        functionArgs.nights
      );
    }

    const secondResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        ...messages,
        responseMessage,
        {
          role: 'function',
          name: functionName,
          content: JSON.stringify(functionResult)
        }
      ]
    });

    return secondResponse.choices[0].message.content;
  }

  return responseMessage.content;
}

module.exports = { chatbotResponse };