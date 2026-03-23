'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import ConnectWallet from './components/ConnectWallet';

interface WhaleData {
  name: string;
  type: string;
  balance: number;
  usdValue: string;
  latestTransaction: {
    signature: string;
    timestamp: string;
    status: string;
  } | null;
  lastChecked: string;
}

interface WhaleDataMap {
  [address: string]: WhaleData;
}

export default function Home() {
  const { connected, publicKey } = useWallet();
  const [whaleData, setWhaleData] = useState<WhaleDataMap>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchWhaleData = async () => {
      try {
        // In production, this would be an API endpoint
        // For now, we'll simulate data from our backend
        const response = await fetch('/api/whales');
        const data = await response.json();
        setWhaleData(data);
        setLastUpdate(new Date().toLocaleString());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching whale data:', error);
        setLoading(false);
      }
    };

    fetchWhaleData();
    const interval = setInterval(fetchWhaleData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const whales = Object.entries(whaleData);

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
              <p className="text-gray-400 text-sm mt-1">Track Solana whale movements in real-time</p>
            </div>
            <div className="flex items-center gap-4">
              {connected && publicKey && (
                <>
                  <a
                    href="/dashboard"
                    className="bg-purple-600/50 hover:bg-purple-600 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Dashboard
                  </a>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Connected</div>
                    <div className="text-xs text-purple-300 font-mono">
                      {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                    </div>
                  </div>
                </>
              )}
              <ConnectWallet />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading whale data...</p>
          </div>
        ) : whales.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No whale data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whales.map(([address, whale]) => (
              <div
                key={address}
                className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition-all"
              >
                {/* Whale Name & Type */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-purple-300">{whale.name}</h3>
                  <p className="text-sm text-gray-400">{whale.type}</p>
                </div>

                {/* Balance */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    {whale.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} SOL
                  </div>
                  <div className="text-sm text-green-400">
                    ${parseFloat(whale.usdValue).toLocaleString()}
                  </div>
                </div>

                {/* Latest Transaction */}
                {whale.latestTransaction && (
                  <div className="border-t border-purple-500/20 pt-4">
                    <div className="text-xs text-gray-400 mb-2">Latest Transaction</div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          whale.latestTransaction.status === 'success'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {whale.latestTransaction.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(whale.latestTransaction.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Wallet Address */}
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <div className="text-xs text-gray-500 font-mono">
                    {address.substring(0, 8)}...{address.substring(address.length - 6)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coming Soon Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Get Instant Alerts</h2>
          <p className="text-gray-400 mb-6">
            Be the first to know when whales move. Custom alerts, Telegram notifications, and more.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {connected ? 'Go to Dashboard →' : 'Connect Wallet to Get Started'}
          </a>
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
