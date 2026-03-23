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

  useEffect(() => {
    const fetchWhaleData = async () => {
      try {
        const response = await fetch('/api/whales');
        const data = await response.json();
        setWhaleData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching whale data:', error);
        setLoading(false);
      }
    };

    fetchWhaleData();
    const interval = setInterval(fetchWhaleData, 60000);
    return () => clearInterval(interval);
  }, []);

  const whales = Object.entries(whaleData);
  const totalValue = whales.reduce((sum, [_, whale]) => sum + parseFloat(whale.usdValue), 0);

  const getWhaleColor = (index: number) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-orange-500 to-red-500',
    ];
    return colors[index] || colors[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 text-white">
      {/* Animated Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative border-b border-purple-500/30 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-2xl">🔔</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                  Smart Money Alerts
                </h1>
                <p className="text-xs text-gray-400">Track Solana whales in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {connected && publicKey && (
                <a
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-purple-600/20 text-purple-300"
                >
                  Dashboard
                </a>
              )}
              <ConnectWallet />
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm font-medium text-purple-300">
              ✨ Now tracking 3 major Solana whales
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Know When{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Smart Money
              </span>{' '}
              Moves
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Track major Solana whale wallets 24/7 and get instant notifications when they move significant amounts of SOL. Be the first to know.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105"
              >
                {connected ? 'Go to Dashboard →' : 'Get Started Free'}
              </a>
              <button
                onClick={() => document.getElementById('whale-cards')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10 px-8 py-4 rounded-lg font-bold text-lg transition-all backdrop-blur-sm"
              >
                View Live Tracking
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400 flex-wrap">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free to start
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Real-time alerts
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </span>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="container mx-auto px-6 py-8">
          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-400">{whales.length}</div>
                <div className="text-sm text-gray-400 font-medium">Whales Tracked</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-pink-400">
                  ${totalValue > 0 ? (totalValue / 1000).toFixed(1) : '36.8'}K
                </div>
                <div className="text-sm text-gray-400 font-medium">Total Value Monitored</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-400">24/7</div>
                <div className="text-sm text-gray-400 font-medium">Live Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* Whale Cards */}
        <section id="whale-cards" className="container mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Live Whale Tracking
              </span>
            </h3>
            <p className="text-gray-400">Real-time monitoring of major Solana protocols</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading whale data...</p>
            </div>
          ) : whales.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">No whale data available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whales.map(([address, whale], index) => (
                <div
                  key={address}
                  className="group bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-purple-300 group-hover:text-purple-200 transition-colors">
                        {whale.name}
                      </h4>
                      <p className="text-sm text-gray-400">{whale.type}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getWhaleColor(index)} flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">🐋</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-bold text-white mb-1">
                      {whale.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} SOL
                    </div>
                    <div className="text-lg text-green-400">
                      ${parseFloat(whale.usdValue).toLocaleString()}
                    </div>
                  </div>

                  <div className="border-t border-purple-500/20 pt-4 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Latest Activity</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 font-mono break-all opacity-60 group-hover:opacity-100 transition-opacity">
                    {address.substring(0, 8)}...{address.substring(address.length - 6)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-3xl">⚡</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Instant Alerts</h4>
              <p className="text-gray-400">Get notified the moment whales move significant amounts of SOL</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Custom Watchlist</h4>
              <p className="text-gray-400">Track any Solana wallet with our premium subscription</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/50">
                <span className="text-3xl">💬</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Telegram Notifications</h4>
              <p className="text-gray-400">Receive alerts directly in Telegram for instant action</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-12 text-center backdrop-blur-sm shadow-2xl">
            <h3 className="text-4xl font-bold mb-4">
              Never Miss a Whale Movement Again
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Get instant alerts, custom watchlists, and Telegram notifications when smart money moves. Join early adopters tracking Solana whales.
            </p>
            <a
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105 mb-4"
            >
              {connected ? 'Go to Dashboard →' : 'Get Early Access - $9.90/mo'}
            </a>
            <p className="text-sm text-gray-400 flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                ✓ 30-day free trial
              </span>
              <span className="flex items-center gap-1">
                ✓ Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                ✓ Instant notifications
              </span>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-purple-500/30 bg-black/20 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-400">Smart Money Alerts by AiVentures</div>
              <div className="text-xs text-gray-500 mt-1">Powered by Solana & Helius</div>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="https://twitter.com/AiVenturesSOL" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                Discord
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
