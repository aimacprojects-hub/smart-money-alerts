import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * GET /api/user/[sessionToken]
 * Get user profile by session token
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionToken: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/${params.sessionToken}`);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/[sessionToken]
 * Update user profile
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sessionToken: string } }
) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/user/${params.sessionToken}`, {
      method: 'PATCH',
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
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
