-- Smart Money Alerts - User Database Schema
-- SQLite database for user accounts and subscriptions

-- Users table (stores wallet-based accounts)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,  -- UUID
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  email TEXT,
  created_at TEXT NOT NULL,  -- ISO timestamp
  last_login TEXT,
  subscription_tier TEXT DEFAULT 'free',  -- 'free' or 'paid'
  subscription_expires_at TEXT,  -- ISO timestamp, NULL for free tier
  telegram_user_id TEXT,  -- For Telegram notifications
  telegram_username TEXT,
  is_active INTEGER DEFAULT 1,  -- 1=active, 0=disabled
  total_paid_sol REAL DEFAULT 0.0  -- Total SOL paid (for tracking)
);

-- Watchlist table (custom wallets users want to track)
CREATE TABLE IF NOT EXISTS watchlist (
  id TEXT PRIMARY KEY,  -- UUID
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  wallet_name TEXT,  -- User-defined name for the wallet
  added_at TEXT NOT NULL,  -- ISO timestamp
  is_active INTEGER DEFAULT 1,  -- 1=active, 0=disabled
  alert_threshold_percent REAL DEFAULT 5.0,  -- % change to trigger alert
  alert_threshold_sol REAL DEFAULT 100.0,  -- Absolute SOL to trigger alert
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, wallet_address)
);

-- Payment transactions table (Solana Pay transactions)
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,  -- UUID
  user_id TEXT NOT NULL,
  transaction_signature TEXT UNIQUE NOT NULL,  -- Solana tx signature
  amount_sol REAL NOT NULL,
  amount_usd REAL,  -- USD value at time of payment
  payment_date TEXT NOT NULL,  -- ISO timestamp
  subscription_start_date TEXT NOT NULL,
  subscription_end_date TEXT NOT NULL,
  status TEXT DEFAULT 'pending',  -- 'pending', 'confirmed', 'failed'
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User sessions table (for auth tokens)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,  -- UUID (session token)
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  last_active TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
