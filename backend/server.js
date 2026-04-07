import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🧠 memory
let chatHistory = [];

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const systemPrompt = `You are MemeBot.

- Funny Indian friend
- Hindi + Hinglish meme tone
- Roast playfully
- Never repeat replies
- Always continue conversation

IMPORTANT:
- Handle short msgs like "hi", "ok", "no"
- Reply in 1–2 lines
- Be natural and human-like`;

  try {
    // 🧠 save user msg
    chatHistory.push({
      role: "user",
      content: message
    });

    if (chatHistory.length > 8) chatHistory.shift();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory
          ],
          temperature: 1.2,
          max_tokens: 200
        })
      }
    );

    const data = await response.json();

    console.log("Groq:", data);

    let reply =
      data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      reply = "abe kuch interesting bol na 😭";
    }

    // 🧠 save bot reply
    chatHistory.push({
      role: "assistant",
      content: reply
    });

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server broke 💀" });
  }
});

// 🐱 meme endpoint
app.get("/meme", async (req, res) => {
  try {
    const subs = ["catmemes", "cats", "funnycats", "memes"];
    const sub = subs[Math.floor(Math.random() * subs.length)];

    const response = await fetch(
      `https://meme-api.com/gimme/${sub}`
    );

    const data = await response.json();

    res.json({ url: data.url });

  } catch {
    res.status(500).json({ error: "meme failed 💀" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});