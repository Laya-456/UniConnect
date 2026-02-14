import pool from '../db.js';
import { updateStreak } from '../utils/streak.js';

export async function getMyMood(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.execute(
      'SELECT id, mood_value, note, created_at FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mood history' });
  }
}

export async function logMood(req, res) {
  try {
    const userId = req.user.id;
    const { mood_value, note } = req.body;

    if (mood_value === undefined || mood_value === null) {
      return res.status(400).json({ error: 'mood_value (1-10) is required' });
    }
    const value = parseInt(mood_value, 10);
    if (isNaN(value) || value < 1 || value > 10) {
      return res.status(400).json({ error: 'mood_value must be between 1 and 10' });
    }

    await pool.execute(
      'INSERT INTO mood_logs (user_id, mood_value, note) VALUES (?, ?, ?)',
      [userId, value, note || null]
    );
    await updateStreak(userId);

    const [rows] = await pool.execute('SELECT id, mood_value, note, created_at FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [userId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log mood' });
  }
}

export async function getMoodMeter(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT mood_value FROM mood_logs WHERE DATE(created_at) = CURDATE()`
    );

    let positive = 0;
    let neutral = 0;
    let stressed = 0;
    const total = rows.length;

    rows.forEach((r) => {
      const v = r.mood_value;
      if (v >= 7) positive++;
      else if (v >= 4) neutral++;
      else stressed++;
    });

    res.json({
      total,
      positive: total ? Math.round((positive / total) * 100) : 0,
      neutral: total ? Math.round((neutral / total) * 100) : 0,
      stressed: total ? Math.round((stressed / total) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mood meter' });
  }
}
