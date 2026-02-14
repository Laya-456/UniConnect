import pool from '../db.js';

export function getInfo(req, res) {
  res.json({
    counselling: {
      name: 'Campus Counselling Centre',
      phone: '+1 (555) 123-4567',
      email: 'counselling@campus.edu',
      hours: 'Mon–Fri 9am–5pm',
    },
    emergency: {
      name: '24/7 Crisis Helpline',
      phone: '1-800-273-8255',
      text: 'Text HOME to 741741',
    },
  });
}

export async function checkLowMoodSuggestion(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.execute(
      `SELECT mood_value FROM mood_logs 
       WHERE user_id = ? 
       ORDER BY created_at DESC LIMIT 5`,
      [userId]
    );
    const lowCount = rows.filter((r) => r.mood_value <= 2).length;
    const showSuggestion = lowCount >= 3;
    res.json({
      showSuggestion,
      message: showSuggestion
        ? "You've logged low mood a few times recently. Consider reaching out to the Wellness Centre or a friend."
        : null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check suggestion' });
  }
}
