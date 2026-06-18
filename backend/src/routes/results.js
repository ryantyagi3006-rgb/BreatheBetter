const express = require('express');
const supabase = require('../lib/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('user_id', req.user.sub)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { fev1, fvc, ratio, status, readings, calibration_factor } = req.body;
  if (fev1 == null || fvc == null || ratio == null) {
    return res.status(400).json({ error: 'fev1, fvc, ratio are required' });
  }

  const { data, error } = await supabase.from('results').insert({
    user_id: req.user.sub,
    email: req.user.email,
    fev1,
    fvc,
    ratio,
    status: status ?? (ratio >= 70 ? 'Normal' : ratio >= 60 ? 'Borderline' : 'Low'),
    readings: readings ?? [],
    calibration_factor: calibration_factor ?? 1.0,
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('results')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.sub);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
