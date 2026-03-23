import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "./providers/WalletProvider";

export const metadata: Metadata = {
  title: "Smart Money Alerts - Track Solana Whales",
  description: "Real-time whale wallet tracking for Solana. Get instant alerts when big money moves.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
