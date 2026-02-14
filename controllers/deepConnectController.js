import pool from '../db.js';

export async function saveResponse(req, res) {
  try {
    const userId = req.user.id;
    const { partner_id, response } = req.body;

    if (!partner_id || !response || !response.trim()) {
      return res.status(400).json({ error: 'partner_id and response are required' });
    }

    const partnerId = parseInt(partner_id, 10);
    if (isNaN(partnerId) || partnerId === userId) {
      return res.status(400).json({ error: 'Invalid partner' });
    }

    await pool.execute(
      'INSERT INTO deep_connect_responses (user_id, partner_id, response) VALUES (?, ?, ?)',
      [userId, partnerId, response.trim()]
    );

    res.status(201).json({ message: 'Response saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save deep connect response' });
  }
}
