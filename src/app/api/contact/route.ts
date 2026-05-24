import { NextResponse } from 'next/server';
import { saveContact } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Save contact inquiry in DB
    await saveContact(body);
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API Error in saving contact form:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
