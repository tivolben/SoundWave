import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://sound-wave-frontend-eight.vercel.app"
}));

app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/send", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("TOKEN exists:", !!TELEGRAM_TOKEN);
    console.log("CHAT exists:", !!CHAT_ID);

    const { name, phone, wishes } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (!TELEGRAM_TOKEN || !CHAT_ID) {
      return res.status(500).json({ error: "Env variables missing" });
    }

    const text = `
Новая заявка:
Имя: ${name}
Телефон: ${phone}
Сообщение: ${wishes || "Отсутствует"}
    `;

    const tgResponse = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text,
      }
    );

    console.log("Telegram response:", tgResponse.data);

    res.json({ success: true });
  } catch (err) {
    console.log("ERROR RESPONSE:", err?.response?.data || err.message);

    res.status(500).json({
      error: "Server error",
      details: err?.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});