import express from "express";
import bodyParser from "body-parser";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// Replace with your actual API credentials
const apiId = 29270824;
const apiHash = "0fdbf63e8de8583ddcc1f2bbabcca3ad";

app.post("/generate-session", async (req, res) => {
  try {
    const { phone, code, password } = req.body;
    const stringSession = new StringSession("");

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.start({
      phoneNumber: async () => phone,
      phoneCode: async () => code,
      password: async () => password || "",
      onError: (err) => console.log(err),
    });

    const sessionString = client.session.save();
    await client.disconnect();

    res.json({ success: true, session: sessionString });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server running...");
});
