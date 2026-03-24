import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * POST /api/payment/[sessionToken]/[paymentId]/confirm
 * Confirm payment and activate subscription
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { sessionToken: string; paymentId: string } }
) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/payment/${params.sessionToken}/${params.paymentId}/confirm`,
      { method: 'POST' }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
