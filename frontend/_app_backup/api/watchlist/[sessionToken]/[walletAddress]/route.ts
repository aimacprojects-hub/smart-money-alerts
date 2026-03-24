import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * DELETE /api/watchlist/[sessionToken]/[walletAddress]
 * Remove wallet from watchlist
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sessionToken: string; walletAddress: string } }
) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/watchlist/${params.sessionToken}/${params.walletAddress}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from watchlist' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
