import { NextResponse } from 'next/server';
import { saveCareer } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Save career job application in DB
    await saveCareer(body);
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Error in saving job application:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
