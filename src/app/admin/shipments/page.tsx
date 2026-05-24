import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Plus } from "lucide-react";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const query = searchParams.q || "";

  const shipments = await prisma.shipment.findMany({
    where: {
      OR: [
        { trackingNumber: { contains: query } },
        { receiverName: { contains: query } },
        { receiverCity: { contains: query } }
      ]
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1>Shipments Directory</h1>
          <p>Manage and track all packages</p>
        </div>
        <Link href="/admin/shipments/new" className="admin-btn">
          <Plus size={18} /> Book Shipment
        </Link>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header" style={{ flexDirection: 'row', gap: '16px' }}>
          <h2>All Shipments</h2>
          <form className="admin-search-form">
            <div className="form-input-wrapper">
              <div className="form-icon">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                name="q" 
                defaultValue={query}
                placeholder="Search tracking #, name, or city..." 
                className="form-input"
              />
            </div>
          </form>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tracking No.</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>
                    <span style={{ fontWeight: 500, color: '#fff' }}>{shipment.trackingNumber}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '14px', color: '#fff' }}>{shipment.senderName}</div>
                    <div style={{ fontSize: '12px', color: '#737373' }}>{shipment.senderCity}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '14px', color: '#fff' }}>{shipment.receiverName}</div>
                    <div style={{ fontSize: '12px', color: '#737373' }}>{shipment.receiverCity}</div>
                  </td>
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
                  <td>
                    <Link href={`/admin/shipments/${shipment.id}`} className="admin-link text-sm font-medium">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#737373' }}>
                    No shipments found matching "{query}".
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
