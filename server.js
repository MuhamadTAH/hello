const express = require("express");
const axios = require("axios");
const app = express();

const CLIENT_KEY = "YOUR_TIKTOK_CLIENT_KEY";
const CLIENT_SECRET = "YOUR_TIKTOK_CLIENT_SECRET";
const REDIRECT_URI = "https://your-glitch-project.glitch.me/callback";

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post("https://open.tiktokapis.com/v2/oauth/token/", {
      client_key: CLIENT_KEY,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    });

    const user = response.data;
    res.send(`<h1>Logged in with TikTok!</h1><pre>${JSON.stringify(user, null, 2)}</pre>`);
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running");
});
