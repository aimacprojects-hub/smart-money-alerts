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

  const getWhaleGradient = (index: number) => {
    const gradients = [
      'from-violet-500 via-purple-500 to-fuchsia-500',
      'from-cyan-500 via-blue-500 to-indigo-500',
      'from-amber-500 via-orange-500 to-red-500',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950"></div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

      {/* Animated Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-blob"></div>
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-48 left-1/3 w-96 h-96 bg-violet-500/20 rounded-full blur-[128px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/5 backdrop-blur-xl bg-black/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-lg opacity-50"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  Smart Money Alerts
                </h1>
                <p className="text-xs text-gray-500 leading-none">Real-time whale tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {connected && publicKey && (
                <a
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:bg-white/5 text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
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
        <section className="relative pt-20 pb-16 sm:pt-32 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 backdrop-blur-sm mb-8">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm font-medium text-violet-200">Live tracking 3 major Solana whales</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                Follow the{' '}
                <span className="relative inline-block">
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 blur-2xl opacity-30"></span>
                  <span className="relative bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                    Smart Money
                  </span>
                </span>
                <br />
                <span className="text-gray-400">Before It's Too Late</span>
              </h2>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Track major Solana whale wallets in real-time. Get instant alerts when they move funds.
                Make informed decisions based on what smart money is doing.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <a
                  href="/dashboard"
                  className="group relative inline-flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg">
                    {connected ? 'Go to Dashboard' : 'Start Tracking Free'}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </a>
                <button
                  onClick={() => document.getElementById('whale-cards')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Live Data
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Instant setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
                  <div className="text-center space-y-2">
                    <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-violet-400 to-violet-200 bg-clip-text text-transparent">
                      {whales.length}
                    </div>
                    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Whales Tracked</div>
                    <div className="text-xs text-gray-600">Updated every minute</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-fuchsia-400 to-fuchsia-200 bg-clip-text text-transparent">
                      ${totalValue > 0 ? (totalValue / 1000).toFixed(1) : '36.8'}K
                    </div>
                    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Value</div>
                    <div className="text-xs text-gray-600">Real-time USD value</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
                      24/7
                    </div>
                    <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">Live Monitoring</div>
                    <div className="text-xs text-gray-600">Never miss a move</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Whale Cards Section */}
        <section id="whale-cards" className="relative py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-sm font-medium text-violet-300">Live Data</span>
                </div>
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Active Whale Wallets
                </span>
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Real-time balance monitoring of major Solana protocol treasuries
              </p>
            </div>

            {loading ? (
              <div className="text-center py-24">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-fuchsia-500/20 border-t-fuchsia-500 animate-spin animation-delay-2000"></div>
                </div>
                <p className="text-gray-400 mt-6">Loading whale data...</p>
              </div>
            ) : whales.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-400 text-lg">No whale data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {whales.map(([address, whale], index) => (
                  <div
                    key={address}
                    className="group relative"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${
                          index === 0 ? 'rgba(139, 92, 246, 0.3), rgba(217, 70, 239, 0.3)' :
                          index === 1 ? 'rgba(6, 182, 212, 0.3), rgba(99, 102, 241, 0.3)' :
                          'rgba(251, 146, 60, 0.3), rgba(239, 68, 68, 0.3)'
                        })`
                      }}
                    ></div>
                    <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 group-hover:border-white/20 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white group-hover:text-violet-200 transition-colors mb-1">
                            {whale.name}
                          </h4>
                          <p className="text-sm text-gray-500">{whale.type}</p>
                        </div>
                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getWhaleGradient(index)} flex items-center justify-center shadow-lg`}>
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="mb-6">
                        <div className="text-3xl font-bold text-white mb-2">
                          {whale.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          <span className="text-xl text-gray-500 ml-2">SOL</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-semibold text-emerald-400">
                            ${parseFloat(whale.usdValue).toLocaleString()}
                          </div>
                          <div className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            USD
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="border-t border-white/5 pt-4 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 font-medium">Status</span>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-sm font-medium text-emerald-400">Active</span>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-black/20 border border-white/5">
                        <code className="text-xs font-mono text-gray-500 flex-1 truncate">
                          {address.substring(0, 8)}...{address.substring(address.length - 6)}
                        </code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(address);
                          }}
                          className="flex-shrink-0 p-1.5 rounded hover:bg-white/5 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-500 hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Everything You Need
                </span>
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Professional-grade tools for tracking smart money movements on Solana
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 group-hover:border-white/20 rounded-2xl p-8 transition-all">
                  <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-white">Instant Alerts</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Get notified within seconds when tracked wallets move significant amounts of SOL. Never miss critical movements.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 group-hover:border-white/20 rounded-2xl p-8 transition-all">
                  <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-white">Custom Watchlist</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Track any Solana wallet address. Build your own watchlist of whales, protocols, and smart traders.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 group-hover:border-white/20 rounded-2xl p-8 transition-all">
                  <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-white">Telegram Integration</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Receive instant notifications directly in Telegram. Stay informed wherever you are, on any device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="relative py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-2xl p-12 text-center">
              <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">$36.8K+</div>
                  <div className="text-sm text-gray-400">Value Monitored</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">3</div>
                  <div className="text-sm text-gray-400">Active Whales</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Powered by Helius & Solana blockchain</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl"></div>
              <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-12 sm:p-16 text-center">
                <h3 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Ready to Track Smart Money?
                  </span>
                </h3>
                <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join early adopters who are already tracking whale movements and making informed trading decisions on Solana.
                </p>
                <a
                  href="/dashboard"
                  className="group relative inline-flex items-center justify-center mb-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-lg">
                    {connected ? 'Go to Dashboard' : 'Start Free Trial'}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </a>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    30-day free trial
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Cancel anytime
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Then $9.90/month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-black/40 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-sm font-medium text-gray-400 mb-1">Smart Money Alerts</div>
              <div className="text-xs text-gray-600">Built by AiVentures · Powered by Solana & Helius</div>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://twitter.com/AiVenturesSOL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-violet-400 transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-violet-400 transition-colors"
              >
                Discord
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-violet-400 transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
