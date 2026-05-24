import { NextResponse } from 'next/server';
import { saveShipment } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Save shipment in DB
    const saved = await saveShipment(body);
    
    return NextResponse.json({ success: true, shipment: saved });
  } catch (err: any) {
    console.error('API Error in booking shipment:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
