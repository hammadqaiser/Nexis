import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import BackupManager from "./BackupManager";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Settings size={28} style={{ color: '#a855f7' }} /> System Control Panel
          </h1>
          <p>Super Admin configuration and system maintenance</p>
        </div>
      </div>

      <BackupManager />

    </div>
  );
}
