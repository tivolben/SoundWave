import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://soundwave-music-tben.vercel.app/"
}));

app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/send", async (req, res) => {
  try {
    const { name, phone, wishes } = req.body || {};

    console.log("BODY:", req.body);

    const text = `
Новая заявка:
Имя: ${name}
Телефон: ${phone}
Сообщение: ${wishes || "Отсутствует"}
    `;

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const tg = await axios.post(url, {
      chat_id: CHAT_ID,
      text,
    });

    console.log("TG OK:", tg.data);

    res.json({ success: true });

  } catch (err) {
    console.log("❌ TELEGRAM ERROR:");
    console.log(err?.response?.data || err.message);

    res.status(500).json({
      error: "Telegram failed",
      details: err?.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
