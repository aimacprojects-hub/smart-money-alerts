'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import ConnectWallet from '../components/ConnectWallet';
import SolanaPaySubscribe from '../components/SolanaPaySubscribe';

interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  subscriptionTier: 'free' | 'paid';
  subscriptionExpiresAt?: string;
  telegramUsername?: string;
  totalPaidSol: number;
  createdAt: string;
}

interface WatchlistItem {
  id: string;
  wallet_address: string;
  wallet_name?: string;
  added_at: string;
  alert_threshold_percent: number;
  alert_threshold_sol: number;
}

export default function Dashboard() {
  const { connected, publicKey, signMessage } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletName, setNewWalletName] = useState('');
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Authenticate user when wallet connects
  useEffect(() => {
    if (connected && publicKey && !sessionToken && !authenticating) {
      authenticateUser();
    }
  }, [connected, publicKey]);

  // Load user profile when session token is available
  useEffect(() => {
    if (sessionToken) {
      loadUserProfile();
      loadWatchlist();
    }
  }, [sessionToken]);

  const authenticateUser = async () => {
    if (!publicKey || !signMessage) return;

    setAuthenticating(true);
    try {
      // Create message to sign
      const message = `Sign in to Smart Money Alerts\nWallet: ${publicKey.toString()}\nTimestamp: ${Date.now()}`;
      const messageBytes = new TextEncoder().encode(message);

      // Sign message with wallet
      const signature = await signMessage(messageBytes);
      const signatureBase64 = Buffer.from(signature).toString('base64');

      // Send to backend
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: publicKey.toString(),
          signature: signatureBase64,
          message
        })
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setSessionToken(data.sessionToken);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Failed to authenticate. Please try again.');
      setAuthenticating(false);
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    if (!sessionToken) return;

    try {
      const response = await fetch(`/api/user/${sessionToken}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadWatchlist = async () => {
    if (!sessionToken) return;

    try {
      const response = await fetch(`/api/watchlist/${sessionToken}`);
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.watchlist || []);
      } else if (response.status === 403) {
        // Subscription required - that's okay
        setWatchlist([]);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  const addToWatchlist = async () => {
    if (!sessionToken || !newWalletAddress) return;

    try {
      const response = await fetch(`/api/watchlist/${sessionToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: newWalletAddress,
          walletName: newWalletName || undefined
        })
      });

      if (response.ok) {
        setNewWalletAddress('');
        setNewWalletName('');
        setShowAddWallet(false);
        loadWatchlist();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add wallet');
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      alert('Failed to add wallet to watchlist');
    }
  };

  const removeFromWatchlist = async (walletAddress: string) => {
    if (!sessionToken) return;

    if (!confirm('Remove this wallet from your watchlist?')) return;

    try {
      const response = await fetch(`/api/watchlist/${sessionToken}/${walletAddress}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadWatchlist();
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove wallet');
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-8">Sign in to access your dashboard</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (loading || authenticating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">
            {authenticating ? 'Authenticating...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  const isPaid = user?.subscriptionTier === 'paid';
  const subscriptionActive = isPaid && user?.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Smart Money Alerts
              </h1>
              <p className="text-gray-400 text-sm mt-1">Your Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Home
              </button>
              <ConnectWallet />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upgrade Modal */}
        {showUpgrade && !isPaid && sessionToken && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full">
              <div className="relative">
                <button
                  onClick={() => setShowUpgrade(false)}
                  className="absolute -top-4 -right-4 bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full text-2xl z-10"
                >
                  ×
                </button>
                <SolanaPaySubscribe
                  sessionToken={sessionToken}
                  onSuccess={() => {
                    setShowUpgrade(false);
                    loadUserProfile();
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* User Profile Card */}
        <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {user?.username || 'Anonymous Whale Watcher'}
              </h2>
              <p className="text-sm text-gray-400 font-mono mb-4">
                {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-6)}
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs text-gray-500">Subscription:</span>
                  <div className={`text-lg font-bold ${isPaid ? 'text-green-400' : 'text-gray-400'}`}>
                    {isPaid ? '🔥 PAID' : 'FREE'}
                  </div>
                </div>
                {subscriptionActive && user?.subscriptionExpiresAt && (
                  <div>
                    <span className="text-xs text-gray-500">Expires:</span>
                    <div className="text-sm text-gray-300">
                      {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-500">Total Paid:</span>
                  <div className="text-lg font-bold text-purple-300">
                    {user?.totalPaidSol || 0} SOL
                  </div>
                </div>
              </div>
            </div>
            <div>
              {!isPaid && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Upgrade to Paid - $9.90/mo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Custom Watchlist Section */}
        <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">Custom Watchlist</h3>
              <p className="text-sm text-gray-400 mt-1">
                {isPaid ? 'Track any Solana wallet' : 'Upgrade to paid plan to add custom wallets'}
              </p>
            </div>
            {isPaid && (
              <button
                onClick={() => setShowAddWallet(!showAddWallet)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Add Wallet
              </button>
            )}
          </div>

          {/* Add Wallet Form */}
          {showAddWallet && isPaid && (
            <div className="bg-purple-800/30 border border-purple-500/20 rounded-lg p-4 mb-6">
              <h4 className="font-bold mb-4">Add New Wallet</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Wallet Address *</label>
                  <input
                    type="text"
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    placeholder="Enter Solana wallet address"
                    className="w-full bg-purple-900/50 border border-purple-500/30 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Wallet Name (Optional)</label>
                  <input
                    type="text"
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    placeholder="e.g., My Favorite Whale"
                    className="w-full bg-purple-900/50 border border-purple-500/30 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={addToWatchlist}
                    disabled={!newWalletAddress}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Add to Watchlist
                  </button>
                  <button
                    onClick={() => setShowAddWallet(false)}
                    className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Watchlist Items */}
          {!isPaid ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <p className="text-xl text-gray-400 mb-4">Unlock Custom Watchlist</p>
              <p className="text-gray-500 mb-6">Track any Solana wallet with paid subscription</p>
              <button
                onClick={() => setShowUpgrade(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Upgrade Now - $9.90/mo
              </button>
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl text-gray-400 mb-2">No wallets in your watchlist</p>
              <p className="text-gray-500">Click "Add Wallet" to start tracking</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-purple-800/30 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">
                        {item.wallet_name || 'Unnamed Wallet'}
                      </h4>
                      <p className="text-xs text-gray-400 font-mono break-all">
                        {item.wallet_address}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromWatchlist(item.wallet_address)}
                      className="text-red-400 hover:text-red-300 ml-2"
                      title="Remove from watchlist"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Alert:</span>
                      <span className="text-purple-300 ml-1">
                        {item.alert_threshold_percent}% or {item.alert_threshold_sol} SOL
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Added {new Date(item.added_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Smart Money Alerts by AiVentures | Powered by Solana & Helius</p>
        </div>
      </footer>
    </div>
  );
}
