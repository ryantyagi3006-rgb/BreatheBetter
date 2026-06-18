require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/results', require('./routes/results'));

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.listen(PORT, () => console.log(`BreatheBetter API running on :${PORT}`));
