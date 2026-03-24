import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read whale data from backend database
    const dataPath = path.join(process.cwd(), '../database/whale-data.json');

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({}, { status: 200 });
    }

    const data = fs.readFileSync(dataPath, 'utf-8');
    const whaleData = JSON.parse(data);

    return NextResponse.json(whaleData);
  } catch (error) {
    console.error('Error reading whale data:', error);
    return NextResponse.json({ error: 'Failed to fetch whale data' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
