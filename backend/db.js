// Database helper functions for Smart Money Alerts
// Lightweight SQLite database using better-sqlite3

const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

// Initialize database
const dbPath = path.join(__dirname, '../database/users.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
function initDatabase() {
  const schema = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      wallet_address TEXT UNIQUE NOT NULL,
      username TEXT,
      email TEXT,
      created_at TEXT NOT NULL,
      last_login TEXT,
      subscription_tier TEXT DEFAULT 'free',
      subscription_expires_at TEXT,
      telegram_user_id TEXT,
      telegram_username TEXT,
      is_active INTEGER DEFAULT 1,
      total_paid_sol REAL DEFAULT 0.0
    );

    -- Watchlist table
    CREATE TABLE IF NOT EXISTS watchlist (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      wallet_address TEXT NOT NULL,
      wallet_name TEXT,
      added_at TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      alert_threshold_percent REAL DEFAULT 5.0,
      alert_threshold_sol REAL DEFAULT 100.0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, wallet_address)
    );

    -- Payment transactions table
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      transaction_signature TEXT UNIQUE NOT NULL,
      amount_sol REAL NOT NULL,
      amount_usd REAL,
      payment_date TEXT NOT NULL,
      subscription_start_date TEXT NOT NULL,
      subscription_end_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- User sessions table
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      wallet_address TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      last_active TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
    CREATE INDEX IF NOT EXISTS idx_watchlist_user ON watchlist(user_id);
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
  `;

  db.exec(schema);
  console.log('✓ Database initialized');
}

// Helper to generate UUID
function generateId() {
  return crypto.randomUUID();
}

// Helper to get current ISO timestamp
function now() {
  return new Date().toISOString();
}

// ===== USER FUNCTIONS =====

/**
 * Create or login user with wallet address
 * If wallet exists, update last_login. If not, create new user.
 */
function authenticateWithWallet(walletAddress) {
  const existing = db.prepare('SELECT * FROM users WHERE wallet_address = ?').get(walletAddress);

  if (existing) {
    // Update last login
    db.prepare('UPDATE users SET last_login = ? WHERE id = ?').run(now(), existing.id);
    return existing;
  }

  // Create new user
  const userId = generateId();
  const user = {
    id: userId,
    wallet_address: walletAddress,
    username: null,
    email: null,
    created_at: now(),
    last_login: now(),
    subscription_tier: 'free',
    subscription_expires_at: null,
    telegram_user_id: null,
    telegram_username: null,
    is_active: 1,
    total_paid_sol: 0.0
  };

  db.prepare(`
    INSERT INTO users (id, wallet_address, username, email, created_at, last_login,
                       subscription_tier, subscription_expires_at, telegram_user_id,
                       telegram_username, is_active, total_paid_sol)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    user.id, user.wallet_address, user.username, user.email, user.created_at,
    user.last_login, user.subscription_tier, user.subscription_expires_at,
    user.telegram_user_id, user.telegram_username, user.is_active, user.total_paid_sol
  );

  console.log(`✓ New user created: ${walletAddress.slice(0, 8)}...`);
  return user;
}

/**
 * Get user by wallet address
 */
function getUserByWallet(walletAddress) {
  return db.prepare('SELECT * FROM users WHERE wallet_address = ?').get(walletAddress);
}

/**
 * Get user by ID
 */
function getUserById(userId) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

/**
 * Update user profile
 */
function updateUserProfile(userId, updates) {
  const allowedFields = ['username', 'email', 'telegram_user_id', 'telegram_username'];
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return;

  values.push(userId);
  db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
}

/**
 * Check if user has active paid subscription
 */
function hasActivePaidSubscription(userId) {
  const user = getUserById(userId);
  if (!user || user.subscription_tier !== 'paid') return false;
  if (!user.subscription_expires_at) return false;

  return new Date(user.subscription_expires_at) > new Date();
}

// ===== SESSION FUNCTIONS =====

/**
 * Create session for user
 */
function createSession(userId, walletAddress) {
  const sessionId = generateId();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  db.prepare(`
    INSERT INTO sessions (id, user_id, wallet_address, created_at, expires_at, last_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(sessionId, userId, walletAddress, now(), expiresAt.toISOString(), now());

  return sessionId;
}

/**
 * Validate session token
 */
function validateSession(sessionToken) {
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionToken);

  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    // Session expired, delete it
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionToken);
    return null;
  }

  // Update last active
  db.prepare('UPDATE sessions SET last_active = ? WHERE id = ?').run(now(), sessionToken);
  return session;
}

/**
 * Delete session (logout)
 */
function deleteSession(sessionToken) {
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionToken);
}

// ===== WATCHLIST FUNCTIONS =====

/**
 * Add wallet to user's watchlist
 */
function addToWatchlist(userId, walletAddress, walletName = null, thresholds = {}) {
  const watchlistId = generateId();
  const thresholdPercent = thresholds.percent || 5.0;
  const thresholdSol = thresholds.sol || 100.0;

  try {
    db.prepare(`
      INSERT INTO watchlist (id, user_id, wallet_address, wallet_name, added_at,
                             is_active, alert_threshold_percent, alert_threshold_sol)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `).run(watchlistId, userId, walletAddress, walletName, now(), thresholdPercent, thresholdSol);

    return { id: watchlistId, success: true };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return { success: false, error: 'Wallet already in watchlist' };
    }
    throw error;
  }
}

/**
 * Get user's watchlist
 */
function getWatchlist(userId) {
  return db.prepare('SELECT * FROM watchlist WHERE user_id = ? AND is_active = 1').all(userId);
}

/**
 * Remove wallet from watchlist
 */
function removeFromWatchlist(userId, walletAddress) {
  db.prepare('DELETE FROM watchlist WHERE user_id = ? AND wallet_address = ?').run(userId, walletAddress);
}

// ===== PAYMENT FUNCTIONS =====

/**
 * Record payment transaction
 */
function recordPayment(userId, txSignature, amountSol, amountUsd = null) {
  const paymentId = generateId();
  const paymentDate = now();
  const subscriptionStart = now();
  const subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  db.prepare(`
    INSERT INTO payments (id, user_id, transaction_signature, amount_sol, amount_usd,
                          payment_date, subscription_start_date, subscription_end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(paymentId, userId, txSignature, amountSol, amountUsd, paymentDate, subscriptionStart, subscriptionEnd);

  return paymentId;
}

/**
 * Confirm payment and activate subscription
 */
function confirmPayment(paymentId) {
  const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
  if (!payment) return false;

  // Update payment status
  db.prepare('UPDATE payments SET status = ? WHERE id = ?').run('confirmed', paymentId);

  // Update user subscription
  db.prepare(`
    UPDATE users
    SET subscription_tier = 'paid',
        subscription_expires_at = ?,
        total_paid_sol = total_paid_sol + ?
    WHERE id = ?
  `).run(payment.subscription_end_date, payment.amount_sol, payment.user_id);

  console.log(`✓ Payment confirmed for user ${payment.user_id}`);
  return true;
}

/**
 * Get user's payment history
 */
function getPaymentHistory(userId) {
  return db.prepare('SELECT * FROM payments WHERE user_id = ? ORDER BY payment_date DESC').all(userId);
}

// ===== STATS =====

/**
 * Get database statistics
 */
function getStats() {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const paidUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE subscription_tier = "paid"').get().count;
  const totalRevenue = db.prepare('SELECT SUM(total_paid_sol) as total FROM users').get().total || 0;

  return {
    totalUsers,
    freeUsers: totalUsers - paidUsers,
    paidUsers,
    totalRevenueSol: totalRevenue
  };
}

// Initialize database on module load
initDatabase();

// Export functions
module.exports = {
  db,
  authenticateWithWallet,
  getUserByWallet,
  getUserById,
  updateUserProfile,
  hasActivePaidSubscription,
  createSession,
  validateSession,
  deleteSession,
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  recordPayment,
  confirmPayment,
  getPaymentHistory,
  getStats
};
