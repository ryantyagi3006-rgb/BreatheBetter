const express = require('express');
const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabase');

const router = express.Router();

function makeToken(userId, email) {
  return jwt.sign({ sub: userId, email }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });

  res.json({ token: makeToken(data.user.id, data.user.email), email: data.user.email });
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ token: makeToken(data.user.id, data.user.email), email: data.user.email });
});

// Attempt login, fall back to signup (mirrors original Firebase behaviour)
router.post('/login-or-signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  let { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error && (error.message.includes('Invalid login') || error.message.includes('Email not confirmed') || error.message.includes('user not found'))) {
    ({ data, error } = await supabase.auth.signUp({ email, password }));
  }

  if (error) return res.status(400).json({ error: error.message });
  if (!data?.user) return res.status(400).json({ error: 'Authentication failed' });

  res.json({ token: makeToken(data.user.id, data.user.email), email: data.user.email });
});

module.exports = router;
