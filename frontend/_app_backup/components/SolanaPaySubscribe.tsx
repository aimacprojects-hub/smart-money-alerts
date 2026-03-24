'use client';

import { useEffect, useRef, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createQR, encodeURL, TransferRequestURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

interface SolanaPaySubscribeProps {
  sessionToken: string;
  onSuccess?: () => void;
}

export default function SolanaPaySubscribe({ sessionToken, onSuccess }: SolanaPaySubscribeProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Payment details
  const PRICE_USD = 9.90;
  const SOL_PRICE_USD = 88.37; // Current SOL price (update from API in production)
  const PRICE_SOL = PRICE_USD / SOL_PRICE_USD;
  const RECIPIENT_ADDRESS = 'BqGw3HnmigR2KLpAenbjy2JMEgAc6yLmzd4FyXiJbCEL'; // AiVentures wallet

  // Generate QR code when showQR changes
  useEffect(() => {
    if (showQR && qrRef.current && publicKey) {
      const recipient = new PublicKey(RECIPIENT_ADDRESS);
      const amount = new BigNumber(PRICE_SOL);
      const reference = new PublicKey(publicKey); // Use user's pubkey as reference
      const label = 'Smart Money Alerts Subscription';
      const message = 'Subscribe to Smart Money Alerts - $9.90/month';
      const memo = `SUB-${sessionToken.slice(0, 8)}`;

      const url: TransferRequestURL = encodeURL({
        recipient,
        amount,
        reference,
        label,
        message,
        memo
      });

      const qr = createQR(url, 300, 'transparent');

      // Clear previous QR code
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        qr.append(qrRef.current);
      }
    }
  }, [showQR, publicKey, sessionToken]);

  const handleDirectPayment = async () => {
    if (!publicKey || !sendTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const recipient = new PublicKey(RECIPIENT_ADDRESS);
      const lamports = Math.floor(PRICE_SOL * LAMPORTS_PER_SOL);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports
        })
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      console.log('Transaction sent:', signature);
      setLoading(true);
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      // Record payment in backend
      await fetch(`/api/payment/${sessionToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionSignature: signature,
          amountSol: PRICE_SOL,
          amountUsd: PRICE_USD
        })
      });

      // Note: In production, backend should verify transaction on-chain before confirming
      // For MVP, we'll auto-confirm after recording
      const paymentResponse = await fetch(`/api/payment/${sessionToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionSignature: signature,
          amountSol: PRICE_SOL,
          amountUsd: PRICE_USD
        })
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to record payment');
      }

      const paymentData = await paymentResponse.json();

      // Confirm payment
      await fetch(`/api/payment/${sessionToken}/${paymentData.paymentId}/confirm`, {
        method: 'POST'
      });

      setSuccess(true);
      setLoading(false);

      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
        <p className="text-gray-300 mb-4">
          Your subscription is now active for 30 days
        </p>
        <p className="text-sm text-gray-400">
          You can now access custom watchlist and Telegram alerts
        </p>
      </div>
    );
  }

  return (
    <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-8">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-2">Upgrade to Paid</h3>
        <p className="text-gray-400">Get full access to all features</p>
      </div>

      {/* Pricing */}
      <div className="bg-purple-800/30 border border-purple-500/20 rounded-lg p-6 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">${PRICE_USD}</div>
          <div className="text-xl text-purple-300 mb-1">
            ≈ {PRICE_SOL.toFixed(4)} SOL
          </div>
          <div className="text-sm text-gray-400">per month</div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            <span>Custom wallet watchlist (unlimited)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            <span>Instant Telegram notifications</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            <span>30-day alert history</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-400">✓</span>
            <span>Priority support</span>
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        {/* Direct Payment Button */}
        <button
          onClick={handleDirectPayment}
          disabled={loading || !publicKey}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed px-6 py-4 rounded-lg font-bold text-lg transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Processing...
            </span>
          ) : (
            `Pay ${PRICE_SOL.toFixed(4)} SOL Now`
          )}
        </button>

        {/* QR Code Option */}
        <div className="text-center">
          <button
            onClick={() => setShowQR(!showQR)}
            className="text-purple-300 hover:text-purple-200 text-sm underline"
          >
            {showQR ? 'Hide QR Code' : 'Pay with QR Code (Mobile)'}
          </button>
        </div>

        {showQR && (
          <div className="bg-white rounded-lg p-4 flex justify-center">
            <div ref={qrRef} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 text-center">
          <p>Payment recipient: {RECIPIENT_ADDRESS.slice(0, 8)}...{RECIPIENT_ADDRESS.slice(-6)}</p>
          <p className="mt-1">Secure payment via Solana blockchain</p>
        </div>
      </div>
    </div>
  );
}
