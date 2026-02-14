import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export async function signup(req, res) {
  try {
    const { full_name, email, password, age, role, interests } = req.body;

    if (!full_name || !email || !password || !age || !role) {
      return res.status(400).json({ error: 'Full name, email, password, age and role are required' });
    }

    if (!['student', 'convenor'].includes(role)) {
      return res.status(400).json({ error: 'Role must be student or convenor' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters with 1 uppercase, 1 number and 1 special character',
      });
    }

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute(
      'INSERT INTO users (full_name, email, password, age, role, interests) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, hashedPassword, age, role, interests || null]
    );

    const [rows] = await pool.execute('SELECT id, full_name, email, role FROM users WHERE email = ?', [email]);
    const user = rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during signup' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.execute(
      'SELECT id, full_name, email, password, role, streak_count, last_active_date FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        streak_count: user.streak_count,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
}
