import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import moodRoutes from './routes/mood.js';
import chatRoutes from './routes/chat.js';
import kindnessRoutes from './routes/kindness.js';
import clubsRoutes from './routes/clubs.js';
import usersRoutes from './routes/users.js';
import deepConnectRoutes from './routes/deepConnect.js';
import wellnessRoutes from './routes/wellness.js';
import profileRoutes from './routes/profile.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/mood', moodRoutes);
app.use('/chat', chatRoutes);
app.use('/kindness', kindnessRoutes);
app.use('/clubs', clubsRoutes);
app.use('/users', usersRoutes);
app.use('/deep-connect', deepConnectRoutes);
app.use('/wellness', wellnessRoutes);
app.use('/profile', profileRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`UniConnect API running at http://localhost:${PORT}`);
});
