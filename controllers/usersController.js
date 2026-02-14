import pool from '../db.js';

export async function getMe(req, res) {
  try {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, age, role, interests, streak_count, last_active_date, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = rows[0];
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

export async function updateInterests(req, res) {
  try {
    const userId = req.user.id;
    const { interests } = req.body;
    await pool.execute('UPDATE users SET interests = ? WHERE id = ?', [interests ? interests.trim() : null, userId]);
    const [rows] = await pool.execute('SELECT interests FROM users WHERE id = ?', [userId]);
    res.json({ interests: rows[0].interests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update interests' });
  }
}

export async function getMatchByInterest(req, res) {
  try {
    const myId = req.user.id;
    const [me] = await pool.execute('SELECT interests FROM users WHERE id = ?', [myId]);
    const myInterests = (me[0]?.interests || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
    if (myInterests.length === 0) {
      return res.json([]);
    }

    const [rows] = await pool.execute(
      'SELECT id, full_name, age, role, interests FROM users WHERE id != ? AND role = ?',
      [myId, 'student']
    );

    const scored = rows
      .map((u) => {
        const their = (u.interests || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
        let matches = 0;
        myInterests.forEach((i) => {
          if (their.some((t) => t.includes(i) || i.includes(t))) matches++;
        });
        return { ...u, matchScore: matches };
      })
      .filter((u) => u.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    res.json(scored);
  } catch (err) {
    res.status(500).json({ error: 'Failed to match by interest' });
  }
}

export async function getMatchByMood(req, res) {
  try {
    const myId = req.user.id;
    const [myMood] = await pool.execute(
      'SELECT mood_value FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [myId]
    );
    const currentMood = myMood[0]?.mood_value;
    if (currentMood === undefined || currentMood === null) {
      return res.json([]);
    }

    const low = Math.max(1, currentMood - 1);
    const high = Math.min(10, currentMood + 1);

    const [rows] = await pool.execute(
      `SELECT DISTINCT u.id, u.full_name, u.age, m.mood_value 
       FROM users u 
       INNER JOIN mood_logs m ON m.user_id = u.id 
       WHERE u.id != ? 
         AND m.mood_value BETWEEN ? AND ?
         AND m.id = (SELECT MAX(id) FROM mood_logs WHERE user_id = u.id)
       ORDER BY m.created_at DESC
       LIMIT 10`,
      [myId, low, high]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to match by mood' });
  }
}

export async function getRecentChatPartners(req, res) {
  try {
    const myId = req.user.id;
    const [rows] = await pool.execute(
      `SELECT DISTINCT 
         CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS partner_id 
       FROM chats 
       WHERE sender_id = ? OR receiver_id = ?`,
      [myId, myId, myId]
    );
    const ids = [...new Set(rows.map((r) => r.partner_id))];
    if (ids.length === 0) return res.json([]);

    const placeholders = ids.map(() => '?').join(',');
    const [users] = await pool.execute(
      `SELECT id, full_name, email FROM users WHERE id IN (${placeholders})`,
      ids
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat partners' });
  }
}

export async function getPublicProfile(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid user id' });
    const [rows] = await pool.execute(
      'SELECT id, full_name FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
