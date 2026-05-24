"use client";

import { Database } from "lucide-react";

export default function BackupManager() {
  return (
    <div className="admin-card" style={{ padding: '32px' }}>
      <h2 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Database size={20} style={{ color: '#0ea5e9' }} /> Database & Backups
      </h2>
      <div style={{ marginTop: '24px' }}>
        <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)', padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#0ea5e9' }}>PostgreSQL Cloud Infrastructure</h3>
          <p style={{ margin: 0, color: '#d4d4d4', lineHeight: 1.6 }}>
            The Nexis Couriers platform is now connected to a production PostgreSQL database cluster.
            <br /><br />
            <strong>Automated Backups:</strong> Point-in-time recovery and continuous backup snapshots are now managed automatically by Neon (your database provider). 
            Manual database file downloads are no longer required or supported in the cloud environment.
          </p>
        </div>
      </div>
    </div>
  );
}
