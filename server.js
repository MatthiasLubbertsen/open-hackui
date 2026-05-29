import express from 'express';

const app = express();
const port = 1826;

app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('Received webhook:', req.body);
  res.status(200).send('Webhook received');
});

app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});