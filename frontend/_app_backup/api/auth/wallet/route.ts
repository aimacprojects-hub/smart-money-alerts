import { NextRequest, NextResponse } from 'next/server';

/**
 * Wallet-based authentication endpoint
 * POST /api/auth/wallet
 * Body: { walletAddress: string, signature: string, message: string }
 */

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, message } = await request.json();

    // Validate inputs
    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Verify signature with Solana web3.js
    // For now, we'll trust the wallet connection from client

    // Call backend to create/login user
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/auth/wallet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress })
    });

    if (!response.ok) {
      throw new Error('Backend authentication failed');
    }

    const data = await response.json();

    // Set session cookie
    const responseObj = NextResponse.json({
      success: true,
      user: data.user,
      sessionToken: data.sessionToken
    });

    responseObj.cookies.set('session_token', data.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return responseObj;
  } catch (error) {
    console.error('Wallet auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
