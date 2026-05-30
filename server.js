import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
// Disable dotenv debug tips
dotenv.config({ debug: false });

const app = express();
const port = 1826;
const adminApiKey = process.env.ADMIN_API_KEY;

app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('Received webhook:', req.body);
  res.status(200).send('Webhook received');

  fetch('https://webhooker.matthiaz.dev/api/key')
    .then(res => res.json())
    .then(data => {
      const apiKey = data.apiKey;
      console.log('Generated API Key:', apiKey);
    })
    .catch(err => {
      console.error('Error fetching API key:', err);
    })

    fetch('https://chat.matthiaz.dev/api/v1/users/user/settings/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminApiKey}`
      }
    }).then(res => res.json())
      .then(data => {
        console.log('User settings:', data);
        const oldSettings = data;
      })
      .catch(err => {
        console.error('Error fetching user settings:', err);
      });

    // fetch('https://chat.matthiaz.dev/api/v1/users/user/settings/update', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${adminApiKey}`
    //   },
    //   body: JSON.stringify(req.body)
    // });
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