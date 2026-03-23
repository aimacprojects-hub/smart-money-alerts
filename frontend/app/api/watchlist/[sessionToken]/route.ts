import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * GET /api/watchlist/[sessionToken]
 * Get user's watchlist
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionToken: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/watchlist/${params.sessionToken}`);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get watchlist error:', error);
    return NextResponse.json(
      { error: 'Failed to get watchlist' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/watchlist/[sessionToken]
 * Add wallet to watchlist
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionToken: string } }
) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/watchlist/${params.sessionToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Add to watchlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add to watchlist' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
