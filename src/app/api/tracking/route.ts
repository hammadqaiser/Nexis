import { NextResponse } from 'next/server';
import { getShipment } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Tracking ID is required' }, { status: 400 });
    }
    
    const shipment = await getShipment(id);
    
    if (!shipment) {
      return NextResponse.json({ success: false, error: 'Shipment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, shipment });
  } catch (err: any) {
    console.error('API Error in tracking shipment:', err);
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
