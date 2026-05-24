import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Banknote, CreditCard, DollarSign, Wallet } from "lucide-react";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // Calculate metrics
  const allShipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "desc" }
  });

  const totalRevenue = allShipments.reduce((acc, curr) => acc + curr.price, 0);
  
  const pendingCOD = allShipments
    .filter(s => s.isCOD && s.status !== "Delivered")
    .reduce((acc, curr) => acc + (curr.codAmount || 0), 0);

  const collectedCOD = allShipments
    .filter(s => s.isCOD && s.status === "Delivered")
    .reduce((acc, curr) => acc + (curr.codAmount || 0), 0);

  const pendingCodShipments = allShipments.filter(s => s.isCOD && s.status !== "Delivered");

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1>Billing & Cash Flow</h1>
          <p>Overview of revenue and COD settlements</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Total Revenue</h3>
            <div className="admin-card-icon blue">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="admin-card-value">Rs {totalRevenue}</p>
          <p className="admin-card-desc">All-time shipping fees</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Pending COD</h3>
            <div className="admin-card-icon yellow">
              <Wallet size={20} />
            </div>
          </div>
          <p className="admin-card-value">Rs {pendingCOD}</p>
          <p className="admin-card-desc">To be collected by riders</p>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Collected COD</h3>
            <div className="admin-card-icon green">
              <Banknote size={20} />
            </div>
          </div>
          <p className="admin-card-value">Rs {collectedCOD}</p>
          <p className="admin-card-desc">Successfully delivered</p>
        </div>
      </div>

      {/* Pending COD Shipments Table */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} style={{ color: '#eab308' }} /> Outstanding COD Shipments
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tracking No.</th>
                <th>Receiver</th>
                <th>Destination</th>
                <th>COD Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingCodShipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>
                    <span style={{ fontWeight: 500, color: '#fff' }}>{shipment.trackingNumber}</span>
                  </td>
                  <td style={{ color: '#d4d4d4' }}>
                    {shipment.receiverName}
                  </td>
                  <td style={{ color: '#a3a3a3' }}>
                    {shipment.receiverCity}
                  </td>
                  <td>
                    <span style={{ fontWeight: 500, color: '#10b981' }}>Rs {shipment.codAmount}</span>
                  </td>
                  <td>
                    <span className="admin-badge primary">
                      {shipment.status}
                    </span>
                  </td>
                </tr>
              ))}
              {pendingCodShipments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#737373' }}>
                    No outstanding COD shipments found.
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
