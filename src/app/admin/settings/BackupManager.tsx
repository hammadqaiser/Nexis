"use client";

import { useState, useEffect } from "react";
import { Database, Download, HardDrive, ShieldAlert, RefreshCw } from "lucide-react";

interface BackupFile {
  name: string;
  size: number;
  createdAt: string;
}

export default function BackupManager() {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/backup");
      if (res.ok) {
        const data = await res.json();
        setBackups(data.files || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/admin/backup", { method: "POST" });
      if (res.ok) {
        await fetchBackups();
      } else {
        alert("Failed to generate backup.");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred while generating backup.");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = (filename: string) => {
    window.location.href = `/api/admin/backup?file=${encodeURIComponent(filename)}`;
  };

  return (
    <div className="admin-card" style={{ marginTop: '24px' }}>
      <div className="admin-card-header" style={{ borderBottom: '1px solid #262626', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="admin-card-icon green">
            <Database size={24} />
          </div>
          <div>
            <h2 className="admin-section-title" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>System Backups</h2>
            <p className="admin-card-desc">Generate and download physical database copies</p>
          </div>
        </div>
        <button 
          onClick={handleCreateBackup} 
          disabled={creating}
          className="admin-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {creating ? <RefreshCw size={16} className="animate-spin" /> : <HardDrive size={16} />} 
          {creating ? "Generating..." : "Generate Backup"}
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Date Created</th>
              <th>Size</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#737373' }}>
                  Loading backups...
                </td>
              </tr>
            ) : backups.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#737373' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={24} />
                    <p style={{ margin: 0 }}>No backups found. Generate one now.</p>
                  </div>
                </td>
              </tr>
            ) : backups.map((file) => (
              <tr key={file.name}>
                <td style={{ fontWeight: 500, color: '#fff' }}>{file.name}</td>
                <td style={{ color: '#d4d4d4' }}>{new Date(file.createdAt).toLocaleString()}</td>
                <td style={{ color: '#a3a3a3' }}>{(file.size / 1024).toFixed(2)} KB</td>
                <td>
                  <button 
                    onClick={() => handleDownload(file.name)}
                    className="admin-btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                  >
                    <Download size={14} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
