import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
// Disable dotenv debug tips
dotenv.config({ debug: false });

const app = express();
const port = 1826;
const adminApiKey = process.env.ADMIN_API_KEY;



app.use(express.json());

async function getApiKey(userId) {
  try {
    const resp = await fetch(`https://webhooker.matthiaz.dev/api/key`);
    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    const body = await resp.json();
    return body.apiKey;
  } catch (err) {
    throw err;
  }
}

async function getUserSettings(userId) {
  try {
    const resp = await fetch(`https://chat.matthiaz.dev/api/v1/users/user/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminApiKey}`
      }
    });
    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    const body = await resp.json();
    return body;
  } catch (err) {
    throw err;
  }
}

async function updateUserSettings(userId, settings) {
  const userToken = jwt.sign(
    { id: userId },
    process.env.WEBUI_SECRET_KEY,
    { expiresIn: '5m' }
  );

  try {
    const resp = await fetch(`https://chat.matthiaz.dev/api/v1/users/user/settings/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify(settings)
    });
    if (!resp.ok) throw new Error(`Status ${resp.status}`);
    const body = await resp.json();
    return body;
  } catch (err) {
    throw err;
  }
}

app.post('/webhook', async (req, res) => {
  console.log('Received webhook:', req.body);

  try {
    const apiKey = await getApiKey('user');
    console.log('Fetched API key:', apiKey);

    let userSettings = await getUserSettings('user');
    console.log('Fetched old settings:', userSettings);

    userSettings.ui.directConnections.OPENAI_API_BASE_URLS = ["https://ai.hackclub.com/proxy/v1"];
    userSettings.ui.directConnections.OPENAI_API_KEYS = [apiKey];
    userSettings.ui.directConnections.OPENAI_API_CONFIGS["0"].enable = true;
    userSettings.ui.directConnections.OPENAI_API_CONFIGS["0"].connection_type = "external";
    userSettings.ui.directConnections.OPENAI_API_CONFIGS["0"].auth_type = "bearer";

    console.log(JSON.stringify(userSettings));

    const updateResp = await updateUserSettings(req.user.id, userSettings);
    console.log('Updated settings response:', updateResp);

    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('Webhook handler failed:', err);
    res.status(500).send('Webhook handler failed');
  }
});

app.get('/api/key', (req, res) => {
  // ai generated
  const amsterdamTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
  const randomPart = crypto.randomUUID().replace(/-/g, '').slice(0, 24);
  const apiKey = `sk_${amsterdamTime}_${randomPart}`;
  res.json({ apiKey });
})

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});