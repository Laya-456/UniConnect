# UniConnect – Connecting Campus Beyond Classrooms

> *"We don't connect people by algorithms. We connect them by intention."*

A full-stack hackathon project for **Code for Connection** – transforming casual campus interaction into intentional emotional support.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, mysql2, bcrypt, jsonwebtoken
- **Database:** MySQL

## Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

## Quick Start

### 1. Database

```bash
# In MySQL (or MySQL Workbench / CLI)
mysql -u root -p < database/schema.sql
```

Or run the contents of `database/schema.sql` manually in your MySQL client.

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env: set DB credentials and JWT_SECRET
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### 4. Environment (server)

Create `server/.env` (copy from `server/.env.example`):

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=uniconnect
JWT_SECRET=your_random_secret_key_min_32_chars
```

The frontend dev server proxies `/api` to `http://localhost:5000`, so start the backend first.

## Project Structure

```
uniconnect/
├── client/          → React frontend (Vite)
├── server/          → Node + Express API
├── database/        → MySQL schema
└── README.md
```

## Features

- **Auth:** Signup / Login with JWT, role-based access (student / convenor); logout clears token and redirects to login
- **Profile:** View and edit full name, email, password (bcrypt); display role and streak; secure `PUT /profile/update`
- **Daily Streak:** Tracks activity; resets if 24h skipped (from mood/chat activity)
- **Mood Tracker:** Log mood (1–10) + optional note; view history
- **Campus Mood Meter:** Today’s mood distribution (positive / neutral / stressed)
- **Connect:** Match by interest or by mood; save interests; Deep Connect prompt before opening chat
- **Chat:** Simple send/receive between two users; recent partners list
- **Kindness Wall:** Post and view positive messages
- **Wellness Centre:** Hero, Mindfulness/Yoga, Support Groups, Workshops (external links); On-Campus Resources (counselling + 24/7 crisis from API); low-mood suggestion when applicable
- **Clubs:** List clubs (name, convenor)
- **Themes:** Theme of the Week – Default, Nature, Neon, Retro (stored in localStorage; affects styling only)

## API Overview

| Method | Route | Auth | Description |
|--------|--------|------|-------------|
| POST | /auth/signup | No | Register |
| POST | /auth/login | No | Login; returns JWT + user |
| GET | /users/me | Yes | Current user profile + streak |
| PUT | /users/interests | Yes | Update my interests |
| GET | /users/:id/profile | Yes | Public profile (id, full_name) |
| GET | /users/match/interest | Yes | Match by interests |
| GET | /users/match/mood | Yes | Match by recent mood |
| GET | /users/chat-partners | Yes | Recent chat partners |
| PUT | /profile/update | Yes | Update full_name, email, password |
| GET | /mood | Yes | My mood history |
| POST | /mood | Yes | Log mood (mood_value, note) |
| GET | /mood/meter | Yes | Campus mood percentages (today) |
| GET | /chat/:userId | Yes | Messages with that user |
| POST | /chat | Yes | Send message (receiver_id, message) |
| GET | /kindness | Yes | All kindness posts |
| POST | /kindness | Yes | Post kindness message |
| GET | /clubs | Yes | List clubs |
| POST | /deep-connect | Yes | Save Deep Connect response (partner_id, response) |
| GET | /wellness | No | Counselling + emergency contact info |
| GET | /wellness/suggestion | Yes | Low-mood suggestion (showSuggestion, message) |

The frontend uses base URL `/api`; Vite proxies `/api` to the backend (e.g. `http://localhost:5000`).

## License

MIT – Hackathon project.
