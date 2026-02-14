import bcrypt from 'bcrypt';
import pool from '../db.js';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { full_name, email, new_password } = req.body;

    const updates = [];
    const params = [];

    if (full_name !== undefined) {
      const name = typeof full_name === 'string' ? full_name.trim() : '';
      if (!name) {
        return res.status(400).json({ error: 'Full name cannot be empty' });
      }
      updates.push('full_name = ?');
      params.push(name);
    }

    if (email !== undefined) {
      const emailVal = typeof email === 'string' ? email.trim() : '';
      if (emailVal && !EMAIL_REGEX.test(emailVal)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      const [existing] = await pool.execute('SELECT id FROM users WHERE email = ? AND id != ?', [emailVal || null, userId]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      updates.push('email = ?');
      params.push(emailVal || null);
    }

    if (new_password !== undefined && new_password !== '') {
      if (!PASSWORD_REGEX.test(new_password)) {
        return res.status(400).json({
          error: 'Password must be at least 8 characters with 1 uppercase, 1 number and 1 special character',
        });
      }
      const hashedPassword = await bcrypt.hash(new_password, 10);
      updates.push('password = ?');
      params.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    params.push(userId);
    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await pool.execute(sql, params);

    const [rows] = await pool.execute(
      'SELECT id, full_name, email, age, role, interests, streak_count, last_active_date, created_at FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
