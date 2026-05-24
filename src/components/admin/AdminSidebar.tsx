"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  CreditCard, 
  LogOut,
  Receipt,
  Settings,
  Calculator
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Shipments", href: "/admin/shipments", icon: Package },
    { name: "Rates Control", href: "/admin/rates", icon: Calculator },
    { name: "Invoices", href: "/admin/invoices", icon: Receipt },
    { name: "Billing", href: "/admin/billing", icon: CreditCard, roles: ["ADMIN", "FRANCHISE"] },
    { name: "Users & Staff", href: "/admin/users", icon: Users, roles: ["ADMIN"] },
    { name: "Settings & Backups", href: "/admin/settings", icon: Settings, roles: ["ADMIN"] },
  ];

  const filteredNav = navItems.filter(item => !item.roles || item.roles.includes(user.role as string));

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar-header">
          NEXIS<span>ADMIN</span>
        </div>
        <div className="admin-sidebar-nav">
          {filteredNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="admin-sidebar-footer">
        <div className="admin-user-card">
          <div className="admin-user-avatar">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="admin-user-info">
            <p className="admin-user-name">{user.name}</p>
            <p className="admin-user-role">{user.role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="admin-logout-btn"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
