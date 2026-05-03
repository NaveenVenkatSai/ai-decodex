-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Users table (email + password, bcrypt hashed)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT          NOT NULL,
  email         TEXT          UNIQUE NOT NULL,
  password_hash TEXT          NOT NULL,
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  last_login    TIMESTAMPTZ   DEFAULT NOW()
);

-- Saved analyses per user
CREATE TABLE IF NOT EXISTS analyses (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_name  TEXT,
  total_papers  INTEGER       DEFAULT 0,
  result_json   JSONB,
  created_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- Study plans per user
CREATE TABLE IF NOT EXISTS study_plans (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_id   INTEGER       REFERENCES analyses(id) ON DELETE SET NULL,
  plan_json     JSONB,
  created_at    TIMESTAMPTZ   DEFAULT NOW()
);

-- Disable Row Level Security for now (enable later for production)
ALTER TABLE users      DISABLE ROW LEVEL SECURITY;
ALTER TABLE analyses   DISABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans DISABLE ROW LEVEL SECURITY;
