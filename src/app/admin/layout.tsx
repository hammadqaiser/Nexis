import "./admin.css";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-overlay">
      <div className="admin-container">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Pane */}
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
