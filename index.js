const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/send", async (req, res) => {
  try {
    const { name, phone, wishes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    const text = `
📩 Новая заявка:
👤 Имя: ${name}
📞 Телефон: ${phone}
💬 Сообщение: ${wishes || "нет"}
    `;

    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text,
      },
      {
        timeout: 10000,
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.log("ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Telegram request failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});