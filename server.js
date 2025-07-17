// server.js -- TikTok OAuth & Static Hosting
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Load from .env for security
const CLIENT_KEY = process.env.CLIENT_KEY || 'YOUR_TIKTOK_CLIENT_KEY';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'YOUR_TIKTOK_CLIENT_SECRET';
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://your-glitch-project.glitch.me/callback';

// Serve static index.html
app.use(express.static(path.join(__dirname)));

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code parameter');
  try {
    const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
      client_key: CLIENT_KEY,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    });
    const user = response.data;
    res.send(`
      <h1>Logged in with TikTok!</h1>
      <pre>${JSON.stringify(user, null, 2)}</pre>
      <p><a href="/">Back to Home</a></p>
    `);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Authentication error: ' + (error.response?.data?.message || error.message));
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// .env file (create in root):
// CLIENT_KEY=YOUR_TIKTOK_CLIENT_KEY
// CLIENT_SECRET=YOUR_TIKTOK_CLIENT_SECRET
// REDIRECT_URI=https://your-glitch-project.glitch.me/callback
