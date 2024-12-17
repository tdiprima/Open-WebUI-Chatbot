const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const port = 3002;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const apiKey = process.env.OPENWEBUI_API_KEY; // Load the API key
if (!apiKey) {
  console.error("API Key is missing. Check your .env file or environment variables.");
  process.exit(1); // Exit if no API key is found
}
// console.log("API Key in Use:", apiKey);

app.post("/api/chatbot", async (req, res) => {
  const { question } = req.body;
  const url = 'http://localhost:3000/api/chat/completions';

  const requestBody = {
    model: 'mistral:latest',
    messages: [{ role: 'user', content: question }]
  };

  try {
    const openWebUIResponse = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    const chatbotResponse = openWebUIResponse.data.choices[0].message.content;
    res.json({ response: chatbotResponse });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ response: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
