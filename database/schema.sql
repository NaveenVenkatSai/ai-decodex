-- Run this in your MySQL at root@127.0.0.1:3306
-- Creates the database and all required tables for AI DecodeX

CREATE DATABASE IF NOT EXISTS ai_decodex;
USE ai_decodex;

-- Users table (populated via Google OAuth)
CREATE TABLE IF NOT EXISTS users (
  id            VARCHAR(255)  PRIMARY KEY,
  name          VARCHAR(255),
  email         VARCHAR(255)  UNIQUE NOT NULL,
  image         TEXT,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  last_login    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sessions table (managed by NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
  id            VARCHAR(255)  PRIMARY KEY,
  user_id       VARCHAR(255)  NOT NULL,
  session_token VARCHAR(255)  UNIQUE NOT NULL,
  expires       DATETIME      NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Saved analyses per user
CREATE TABLE IF NOT EXISTS analyses (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  user_id       VARCHAR(255)  NOT NULL,
  subject_name  VARCHAR(255),
  total_papers  INT           DEFAULT 0,
  result_json   LONGTEXT,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Study plans per user
CREATE TABLE IF NOT EXISTS study_plans (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  user_id       VARCHAR(255)  NOT NULL,
  analysis_id   INT,
  plan_json     LONGTEXT,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE SET NULL
);
