import { NextResponse } from 'next/server';
import { saveFranchise } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Save franchise application in DB
    await saveFranchise(body);
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Error in saving franchise application:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
