import { NextRequest, NextResponse } from 'next/server';

// Make this route dynamic to prevent static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API test endpoint is working',
    timestamp: new Date().toISOString(),
  });
}