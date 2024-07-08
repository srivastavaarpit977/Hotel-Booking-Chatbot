# Room Booking Chatbot
This is a chatbot that allows users to book rooms in a hotel. The chatbot is built using ExpressJS and ChatGPT. The chatbot can provide information about the hotel and the rooms available. It also allows users to book rooms based on their preferences.

## Features
- Provides information about the hotel
- Performs room booking

## How to Use
To use the chatbot, follow these steps:
1. Clone the repository
    ```shell
    git clone https://github.com/srivastavaarpit977/Hotel-Booking-Chatbot.git
    ```
2. Install the dependencies
    ```shell
    npm install
    ```
3. Create a `.env` file in the root directory.
    ```shell
    OPEN_AI_API_KEY={YOUR_OPEN_AI_API_KEY}
    ```
    You can get the ChatGPT API key by signing up on the [OpenAI website](https://platform.openai.com/).
4. Start the server
    ```shell
    npm start
    ```
5. Start chatting with the chatbot

## API Endpoints
- `/chat`: This endpoint is used to send messages to the chatbot and get responses.
    It is a POST request that accepts the following parameters:
    - `sessionId`: The session ID of the client
    - `userId`: The user ID of the user
    - `message`: The message sent by the user




