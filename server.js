const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3002;

// Allow only requests from http://127.0.0.1:5500
app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
// app.use(cors({ origin: "*" }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Parse incoming JSON data
app.use(express.json());

// Chatbot API endpoint
app.post("/api/chatbot", async (req, res) => {
  const { question } = req.body;
  console.log("Received question:", question);

  const url = 'http://localhost:3000/api/chat/completions';
  const apiKey = process.env.OPENWEBUI_API_KEY;
  // console.log("API key:", apiKey);

  // Creates a request body with a model and message.
  const requestBody = {
    model: 'mistral:latest',
    messages: [
      {
        role: 'user',
        content: question
      }
    ]
  };

  try {
    // Send the question to Open WebUI API with headers separated
    const openWebUIResponse = await axios.post(url, JSON.stringify(requestBody), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Open WebUI response:", openWebUIResponse.data.choices[0]);

    // Send Open WebUI's response back to the client
    // const chatbotResponse = openWebUIResponse.data.response;
    // res.json({ response: chatbotResponse });
    const chatbotResponse = openWebUIResponse.data.choices[0].message.content;
    res.json({ response: chatbotResponse });
  } catch (error) {
    console.error("Error communicating with Open WebUI:", error.response?.data || error.message);
    res.status(500).json({ response: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
