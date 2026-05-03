import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/send", async (req, res) => {
  try {
    const { name, phone, wishes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const text = `
Новая заявка:
Имя: ${name}
Телефон: ${phone}
Сообщение: ${wishes || "Отсутствует"}
    `;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text,
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});