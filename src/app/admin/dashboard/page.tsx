import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package, TrendingUp, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // Dashboard Aggregations
  const totalShipments = await prisma.shipment.count();
  const activeDeliveries = await prisma.shipment.count({
    where: { status: { in: ["Booked", "In Transit", "Out for Delivery"] } }
  });
  
  const revenueObj = await prisma.shipment.aggregate({
    _sum: { price: true }
  });
  const totalRevenue = revenueObj._sum.price || 0;

  const recentShipments = await prisma.shipment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back, {session.user.name}</p>
        </div>
        <Link href="/admin/shipments/new" className="admin-btn">
          <Package size={18} /> New Shipment
        </Link>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Total Bookings</h3>
            <div className="admin-card-icon blue">
              <Package size={20} />
            </div>
          </div>
          <p className="admin-card-value">{totalShipments}</p>
          <p className="admin-card-desc">All-time packages registered</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Active Deliveries</h3>
            <div className="admin-card-icon yellow">
              <Clock size={20} />
            </div>
          </div>
          <p className="admin-card-value">{activeDeliveries}</p>
          <p className="admin-card-desc">Currently in transit</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Gross Revenue</h3>
            <div className="admin-card-icon green">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="admin-card-value">Rs {totalRevenue.toLocaleString()}</p>
          <p className="admin-card-desc">Total shipping fees generated</p>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2>Recent Shipments</h2>
          <Link href="/admin/shipments" className="admin-link text-sm">View All</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentShipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>
                    <Link href={`/admin/shipments/${shipment.id}`} className="admin-link" style={{ fontWeight: 500 }}>
                      {shipment.trackingNumber}
                    </Link>
                  </td>
                  <td>{shipment.receiverCity}</td>
                  <td>
                    <span className={`admin-badge ${
                      shipment.status === 'Delivered' ? 'success' : 
                      shipment.status === 'Booked' ? 'neutral' : 'primary'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td style={{ color: '#a3a3a3', fontSize: '12px' }}>
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentShipments.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#737373' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={24} />
                      <p style={{ margin: 0 }}>No shipments found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
