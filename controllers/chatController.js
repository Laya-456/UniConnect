import pool from '../db.js';
import { updateStreak } from '../utils/streak.js';

export async function getChatWithUser(req, res) {
  try {
    const myId = req.user.id;
    const otherId = parseInt(req.params.userId, 10);
    if (isNaN(otherId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const [rows] = await pool.execute(
      `SELECT id, sender_id, receiver_id, message, created_at FROM chats 
       WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
       ORDER BY created_at ASC`,
      [myId, otherId, otherId, myId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

export async function sendMessage(req, res) {
  try {
    const senderId = req.user.id;
    const { receiver_id, message } = req.body;

    if (!receiver_id || !message || !message.trim()) {
      return res.status(400).json({ error: 'receiver_id and message are required' });
    }

    const receiverId = parseInt(receiver_id, 10);
    if (isNaN(receiverId) || receiverId === senderId) {
      return res.status(400).json({ error: 'Invalid receiver' });
    }

    const [result] = await pool.execute(
      'INSERT INTO chats (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [senderId, receiverId, message.trim()]
    );
    await updateStreak(senderId);

    const [rows] = await pool.execute(
      'SELECT id, sender_id, receiver_id, message, created_at FROM chats WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
}
