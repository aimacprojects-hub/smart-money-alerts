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

  return (
    <div className="min-h-screen bg-[#0A1929] text-white relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Corner Accent Dots */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-orange-500 rounded-full blur-sm" />
      <div className="absolute top-20 right-20 w-3 h-3 bg-orange-500 rounded-full blur-sm" />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-semibold">Smart Money Alerts</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#tracking" className="text-gray-400 hover:text-white transition-colors">Tracking</a>
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
            </div>

            {/* CTA Button */}
            <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-full font-medium transition-all">
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Headline */}
          <div>
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Track it.<br />
              Trade it.
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Know when Solana whales move before the market does.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-full font-semibold text-lg transition-all inline-flex items-center gap-2">
              Start Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          {/* Right: Telegram Alert Card + Wallet Activity */}
          <div className="relative">
            {/* Corner Frame */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-purple-500/50" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-purple-500/50" />

            <div className="relative space-y-4">
              {/* Telegram Alert Card */}
              <div className="bg-[#0F2642] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.86 8.77c-.14.617-.512.77-1.037.48l-2.87-2.118-1.385 1.335c-.153.153-.282.282-.578.282l.207-2.93 5.342-4.827c.232-.207-.05-.322-.36-.115l-6.6 4.15-2.843-.89c-.617-.193-.63-.617.13-.916l11.11-4.282c.514-.19.964.115.795.915z"/>
                    </svg>
                    <span className="font-medium">Telegram</span>
                  </div>
                  <span className="text-xs bg-white/5 px-2 py-1 rounded-full">2m ago</span>
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-semibold">Jupiter Protocol</span>
                    <span className="text-gray-400">moved</span>
                    <span className="font-bold text-purple-400">377 SOL</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    MC: $33.2K | Age: 2 mins
                  </div>
                  <button className="mt-2 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full hover:bg-green-500/30 transition-colors">
                    Buy
                  </button>
                </div>
              </div>

              {/* Wallet Activity Table */}
              <div className="bg-[#0F2642] border border-white/10 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-3 gap-4 p-4 border-b border-white/10 text-sm text-gray-400">
                  <div>Wallet</div>
                  <div>Token/Age</div>
                  <div className="text-right">Buy/Sell</div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Example Wallet Entry */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                      <div>
                        <div className="text-sm font-medium">Jupiter</div>
                        <div className="text-xs text-gray-500">0x2...0xA</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-blue-400">SOL</div>
                      <div className="text-xs text-gray-500">$33K · SOLANA</div>
                    </div>

                    <div className="text-right">
                      <button className="bg-green-500/20 text-green-400 px-4 py-1.5 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                        Buy 1 ⚡
                      </button>
                      <div className="text-xs text-gray-500 mt-1">$420</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Icon at Bottom */}
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Tracking Section */}
      <div id="tracking" className="relative z-10 container mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Live Data</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Active Whale Wallets</h2>
          <p className="text-gray-400">Real-time monitoring of major Solana protocols</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading whale data...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {whales.map(([address, whale], index) => (
              <div
                key={address}
                className="bg-[#0F2642] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
              >
                {/* Whale Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                      index === 0 ? 'from-purple-500 to-pink-500' :
                      index === 1 ? 'from-blue-500 to-cyan-500' :
                      'from-orange-500 to-red-500'
                    } flex items-center justify-center`}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">{whale.name}</h3>
                      <p className="text-xs text-gray-500">{whale.type}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Active
                  </span>
                </div>

                {/* Balance */}
                <div className="mb-4">
                  <div className="text-3xl font-bold mb-1">{whale.balance.toFixed(2)} SOL</div>
                  <div className="text-sm text-gray-400">{whale.usdValue} <span className="text-emerald-400">USD</span></div>
                </div>

                {/* Stats */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="text-gray-300">{whale.latestTransaction?.status || 'Monitoring'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Activity</span>
                    <span className="text-gray-300">
                      {whale.latestTransaction ?
                        new Date(whale.latestTransaction.timestamp).toLocaleTimeString() :
                        'No recent activity'}
                    </span>
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-mono">{address.slice(0, 8)}...{address.slice(-6)}</span>
                    <button className="text-xs text-gray-400 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Value Card */}
        {!loading && whales.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-sm text-gray-400 mb-2">Total Value Monitored</div>
            <div className="text-5xl font-bold mb-2">${totalValue.toLocaleString()}</div>
            <div className="text-gray-400">Across {whales.length} whale wallets • 24/7 monitoring</div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 bg-[#0F2642] py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400">Professional-grade tools for tracking smart money on Solana</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
              <p className="text-gray-400">Get notified the moment whales move significant amounts of SOL.</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Watchlist</h3>
              <p className="text-gray-400">Track any Solana wallet with our premium subscription.</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.86 8.77c-.14.617-.512.77-1.037.48l-2.87-2.118-1.385 1.335c-.153.153-.282.282-.578.282l.207-2.93 5.342-4.827c.232-.207-.05-.322-.36-.115l-6.6 4.15-2.843-.89c-.617-.193-.63-.617.13-.916l11.11-4.282c.514-.19.964.115.795.915z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Telegram Integration</h3>
              <p className="text-gray-400">Receive instant notifications directly in Telegram.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing CTA */}
      <div id="pricing" className="relative z-10 container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Track Smart Money?</h2>
          <p className="text-xl mb-8 text-white/80">
            Join early adopters who are already tracking whale movements and making informed trading decisions.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>$9.90/month</span>
            </div>
          </div>
          <button className="bg-white text-indigo-600 hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg transition-all inline-flex items-center gap-2">
            Start Free Trial
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg" />
              <span className="font-semibold">Smart Money Alerts</span>
            </div>
            <p className="text-sm text-gray-500">
              Built by AiVentures • Powered by Solana & Helius
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
