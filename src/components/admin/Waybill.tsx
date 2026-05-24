import React from 'react';
import { Shipment, Invoice } from '@prisma/client';
import { BRAND } from '@/lib/constants';

interface WaybillProps {
  shipment: Shipment & { invoice: Invoice | null };
}

export default function Waybill({ shipment }: WaybillProps) {
  // Teal color from the user's provided image
  const tealColor = "#147b82";

  return (
    <div style={{
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: '#fff',
      color: '#000',
      padding: '24px',
      fontFamily: 'sans-serif',
      border: `4px solid ${tealColor}`,
    }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo Placeholder */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: tealColor }}>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>NEXIS ENTERPRISES</h1>
            <h2 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px', fontWeight: 'normal' }}>COURIERS</h2>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>||||||||||||||||||||||||||||||||||||||||||||||||</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: tealColor }}>No. {shipment.trackingNumber.replace('NEX-', '')}</div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ backgroundColor: tealColor, color: '#fff', padding: '4px 16px', fontWeight: 'bold', fontSize: '18px' }}>
              ORIGIN: <span style={{ marginLeft: '8px' }}>{shipment.origin || 'ISB'}</span>
            </div>
            <div style={{ backgroundColor: tealColor, color: '#fff', padding: '4px 16px', fontWeight: 'bold', fontSize: '18px' }}>
              DESTINATION: <span style={{ marginLeft: '8px' }}>{shipment.destination || 'UK'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* From / To Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {/* FROM */}
        <div style={{ border: `2px solid ${tealColor}` }}>
          <div style={{ backgroundColor: tealColor, color: '#fff', padding: '4px 8px', fontWeight: 'bold' }}>FROM (Sender)</div>
          <div style={{ padding: '8px' }}>
            <div style={{ fontSize: '12px' }}>COMPANY NAME:</div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', borderBottom: '1px solid #000', marginBottom: '4px' }}>{shipment.senderName.toUpperCase()}</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', borderBottom: '1px solid #000', marginBottom: '4px' }}>{shipment.senderAddress.toUpperCase()}</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', borderBottom: '1px solid #000', marginBottom: '4px' }}>{shipment.senderCity.toUpperCase()}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>TEL #:</span>
              <span style={{ fontWeight: 'bold' }}>{shipment.senderPhone}</span>
            </div>
          </div>
        </div>

        {/* TO */}
        <div style={{ border: `2px solid ${tealColor}` }}>
          <div style={{ backgroundColor: tealColor, color: '#fff', padding: '4px 8px', fontWeight: 'bold' }}>TO (Receiver)</div>
          <div style={{ padding: '8px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', borderBottom: '1px solid #000', marginBottom: '4px', minHeight: '22px' }}>{shipment.receiverName.toUpperCase()}</div>
            <div style={{ fontWeight: 'bold', fontSize: '16px', borderBottom: '1px solid #000', marginBottom: '4px', minHeight: '20px' }}>{shipment.receiverAddress.toUpperCase()}</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
              <div style={{ flex: 1, borderBottom: '1px solid #000' }}>
                <span style={{ fontSize: '12px', display: 'block' }}>CITY:</span>
                <span style={{ fontWeight: 'bold' }}>{shipment.receiverCity.toUpperCase()}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>TEL #:</span>
              <span style={{ fontWeight: 'bold' }}>{shipment.receiverPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipment Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', marginBottom: '16px', border: `2px solid ${tealColor}` }}>
        <div style={{ gridColumn: '1 / -1', backgroundColor: tealColor, color: '#fff', padding: '4px 8px', fontWeight: 'bold' }}>SHIPMENT DETAILS</div>
        <div style={{ borderRight: `1px solid ${tealColor}`, borderBottom: `1px solid ${tealColor}`, padding: '4px 8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>NO. OF PIECES</div>
          <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>{String(shipment.pieces).padStart(2, '0')}</div>
        </div>
        <div style={{ borderRight: `1px solid ${tealColor}`, borderBottom: `1px solid ${tealColor}`, padding: '4px 8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>WEIGHT (kg)</div>
          <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>{shipment.weight}</div>
        </div>
        <div style={{ borderBottom: `1px solid ${tealColor}`, padding: '4px 8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>DIMENSIONS</div>
          <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>{shipment.dimensions || 'N/A'}</div>
        </div>
        <div style={{ gridColumn: '1 / 2', borderRight: `1px solid ${tealColor}`, padding: '4px 8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>INSURANCE VALUE</span>
        </div>
        <div style={{ gridColumn: '2 / -1', padding: '4px 8px', fontWeight: 'bold' }}>
          {shipment.insuranceValue ? `Rs. ${shipment.insuranceValue}` : 'N/A'}
        </div>
      </div>

      {/* Commodity & Charges */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Commodity */}
          <div style={{ border: `2px solid ${tealColor}`, height: '100px' }}>
            <div style={{ backgroundColor: tealColor, color: '#fff', padding: '4px 8px', fontWeight: 'bold' }}>COMMODITY / SPECIAL INSTRUCTIONS</div>
            <div style={{ padding: '8px', fontWeight: 'bold', fontSize: '18px', fontStyle: 'italic' }}>
              {shipment.instructions || shipment.serviceType}
            </div>
          </div>
          
          {/* Received By */}
          <div style={{ border: `2px solid ${tealColor}` }}>
            <div style={{ backgroundColor: tealColor, color: '#fff', padding: '4px 8px', fontWeight: 'bold' }}>RECEIVED BY NEXIS ENTERPRISES</div>
            <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <div>NAME: <span style={{ textDecoration: 'underline' }}>ADMIN</span></div>
              <div>DATE: <span style={{ textDecoration: 'underline' }}>{new Date(shipment.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>

        {/* Charges */}
        <div style={{ border: `2px solid ${tealColor}` }}>
          <div style={{ backgroundColor: tealColor, color: '#fff', padding: '4px 8px', fontWeight: 'bold' }}>CHARGES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #ccc' }}>
            <div style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>WEIGHT CHARGES</div>
            <div style={{ padding: '4px 8px', textAlign: 'right' }}>{shipment.invoice?.weightCharges || shipment.price}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #ccc' }}>
            <div style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>NON-DOC CHARGES</div>
            <div style={{ padding: '4px 8px', textAlign: 'right' }}>{shipment.invoice?.nonDocCharges || 0}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #ccc' }}>
            <div style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>INSURANCE</div>
            <div style={{ padding: '4px 8px', textAlign: 'right' }}>{shipment.invoice?.insuranceCharges || 0}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #ccc' }}>
            <div style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>OTHER</div>
            <div style={{ padding: '4px 8px', textAlign: 'right' }}>{shipment.invoice?.otherCharges || 0}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #ccc' }}>
            <div style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>TAX</div>
            <div style={{ padding: '4px 8px', textAlign: 'right' }}>{shipment.invoice?.taxAmount || 0}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>TOTAL RS.</div>
            <div style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 'bold' }}>{shipment.invoice?.totalAmount || shipment.price}</div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: tealColor, color: '#fff', padding: '8px 16px', marginTop: '16px', fontSize: '14px', fontWeight: 'bold' }}>
        <div>Tel: +92-300-9844786</div>
        <div>Tel: +92-51-2280786</div>
        <div>info@nexisenterprises.com</div>
        <div>Web: www.nexisenterprises.com</div>
      </div>
    </div>
  );
}
