import pool from '../db.js';

export async function getAll(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT k.id, k.message, k.created_at, u.full_name 
       FROM kindness_posts k 
       LEFT JOIN users u ON k.user_id = u.id 
       ORDER BY k.created_at DESC LIMIT 100`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch kindness posts' });
  }
}

export async function create(req, res) {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO kindness_posts (user_id, message) VALUES (?, ?)',
      [userId, message.trim()]
    );

    const [rows] = await pool.execute(
      'SELECT id, message, created_at FROM kindness_posts WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post kindness message' });
  }
}
