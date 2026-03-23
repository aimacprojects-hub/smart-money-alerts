// Express API server for Smart Money Alerts
// Handles authentication, watchlist, and payment endpoints

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ===== AUTH ENDPOINTS =====

/**
 * POST /api/auth/wallet
 * Authenticate user with wallet address
 */
app.post('/api/auth/wallet', (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Create or login user
    const user = db.authenticateWithWallet(walletAddress);

    // Create session
    const sessionToken = db.createSession(user.id, walletAddress);

    res.json({
      success: true,
      user: {
        id: user.id,
        walletAddress: user.wallet_address,
        username: user.username,
        subscriptionTier: user.subscription_tier,
        subscriptionExpiresAt: user.subscription_expires_at
      },
      sessionToken
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (delete session)
 */
app.post('/api/auth/logout', (req, res) => {
  try {
    const { sessionToken } = req.body;
    if (sessionToken) {
      db.deleteSession(sessionToken);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// ===== USER ENDPOINTS =====

/**
 * GET /api/user/:sessionToken
 * Get user profile by session token
 */
app.get('/api/user/:sessionToken', (req, res) => {
  try {
    const session = db.validateSession(req.params.sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const user = db.getUserById(session.user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      walletAddress: user.wallet_address,
      username: user.username,
      email: user.email,
      subscriptionTier: user.subscription_tier,
      subscriptionExpiresAt: user.subscription_expires_at,
      telegramUserId: user.telegram_user_id,
      telegramUsername: user.telegram_username,
      totalPaidSol: user.total_paid_sol,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * PATCH /api/user/:sessionToken
 * Update user profile
 */
app.patch('/api/user/:sessionToken', (req, res) => {
  try {
    const session = db.validateSession(req.params.sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const { username, email, telegramUserId, telegramUsername } = req.body;

    db.updateUserProfile(session.user_id, {
      username,
      email,
      telegram_user_id: telegramUserId,
      telegram_username: telegramUsername
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ===== WATCHLIST ENDPOINTS =====

/**
 * GET /api/watchlist/:sessionToken
 * Get user's watchlist
 */
app.get('/api/watchlist/:sessionToken', (req, res) => {
  try {
    const session = db.validateSession(req.params.sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Check if user has paid subscription
    const hasPaid = db.hasActivePaidSubscription(session.user_id);

    if (!hasPaid) {
      return res.status(403).json({
        error: 'Paid subscription required',
        subscriptionRequired: true
      });
    }

    const watchlist = db.getWatchlist(session.user_id);

    res.json({ watchlist });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to get watchlist' });
  }
});

/**
 * POST /api/watchlist/:sessionToken
 * Add wallet to watchlist
 */
app.post('/api/watchlist/:sessionToken', (req, res) => {
  try {
    const session = db.validateSession(req.params.sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Check if user has paid subscription
    const hasPaid = db.hasActivePaidSubscription(session.user_id);

    if (!hasPaid) {
      return res.status(403).json({
        error: 'Paid subscription required',
        subscriptionRequired: true
      });
    }

    const { walletAddress, walletName, thresholds } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const result = db.addToWatchlist(session.user_id, walletAddress, walletName, thresholds);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

/**
 * DELETE /api/watchlist/:sessionToken/:walletAddress
 * Remove wallet from watchlist
 */
app.delete('/api/watchlist/:sessionToken/:walletAddress', (req, res) => {
  try {
    const session = db.validateSession(req.params.sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    db.removeFromWatchlist(session.user_id, req.params.walletAddress);

    res.json({ success: true });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

// ===== PAYMENT ENDPOINTS =====

/**
 * POST /api/payment/:sessionToken
 * Record new payment
 */
app.post('/api/payment/:sessionToken', (req, res) => {
  try {
    const session = db.validateSession(req.params.sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const { transactionSignature, amountSol, amountUsd } = req.body;

    if (!transactionSignature || !amountSol) {
      return res.status(400).json({ error: 'Transaction signature and amount required' });
    }

    const paymentId = db.recordPayment(
      session.user_id,
      transactionSignature,
      amountSol,
      amountUsd
    );

    res.json({ success: true, paymentId });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

/**
 * POST /api/payment/:sessionToken/:paymentId/confirm
 * Confirm payment and activate subscription
 */
app.post('/api/payment/:sessionToken/:paymentId/confirm', (req, res) => {
  try {
    const session = db.validateSession(req.params.sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const confirmed = db.confirmPayment(req.params.paymentId);

    if (!confirmed) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

/**
 * GET /api/payment/:sessionToken/history
 * Get payment history
 */
app.get('/api/payment/:sessionToken/history', (req, res) => {
  try {
    const session = db.validateSession(req.params.sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const payments = db.getPaymentHistory(session.user_id);

    res.json({ payments });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

// ===== STATS ENDPOINT =====

/**
 * GET /api/stats
 * Get public stats (for dashboard)
 */
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Smart Money Alerts API server running on port ${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
