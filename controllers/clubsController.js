import pool from '../db.js';

export async function getClubs(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT c.id, c.name, c.created_at, u.full_name AS convenor_name 
       FROM clubs c 
       LEFT JOIN users u ON c.convenor_id = u.id 
       ORDER BY c.name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
}
