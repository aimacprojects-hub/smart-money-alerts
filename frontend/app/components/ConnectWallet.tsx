'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function ConnectWallet() {
  return (
    <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !rounded-lg !font-bold !transition-all" />
  );
}
