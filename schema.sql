-- UniConnect Database Schema
-- Run this in MySQL to set up the database

CREATE DATABASE IF NOT EXISTS uniconnect;
USE uniconnect;

-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  role ENUM('student','convenor') NOT NULL,
  interests VARCHAR(500) DEFAULT NULL,
  streak_count INT DEFAULT 0,
  last_active_date DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mood Logs
CREATE TABLE mood_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  mood_value INT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chats
CREATE TABLE chats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Kindness Posts
CREATE TABLE kindness_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Clubs
CREATE TABLE clubs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  convenor_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (convenor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Deep Connect responses (before chat)
CREATE TABLE deep_connect_responses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  partner_id INT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (partner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX idx_mood_logs_user_created ON mood_logs(user_id, created_at);
CREATE INDEX idx_chats_sender_receiver ON chats(sender_id, receiver_id);
CREATE INDEX idx_mood_logs_created ON mood_logs(created_at);
