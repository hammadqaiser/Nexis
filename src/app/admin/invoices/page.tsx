import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Receipt, Search } from "lucide-react";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  const invoices = await prisma.invoice.findMany({
    where: {
      OR: [
        { invoiceNumber: { contains: query } },
        { shipment: { trackingNumber: { contains: query } } },
        { shipment: { receiverName: { contains: query } } }
      ]
    },
    include: { shipment: true },
    orderBy: { issuedAt: "desc" }
  });

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Receipt size={28} style={{ color: '#10b981' }} /> Master Invoice Ledger
          </h1>
          <p>Financial tracking for all generated shipments</p>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header" style={{ flexDirection: 'row', gap: '16px' }}>
          <h2>All Invoices</h2>
          <form className="admin-search-form">
            <div className="form-input-wrapper">
              <div className="form-icon">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                name="q" 
                defaultValue={query}
                placeholder="Search invoice or tracking #..." 
                className="form-input"
              />
            </div>
          </form>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Tracking No.</th>
                <th>Receiver</th>
                <th>Amount (Incl. Tax)</th>
                <th>Status</th>
                <th>Date Issued</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <span style={{ fontWeight: 500, color: '#fff' }}>{inv.invoiceNumber}</span>
                  </td>
                  <td>
                    <Link href={`/admin/shipments/${inv.shipmentId}`} className="admin-link">
                      {inv.shipment.trackingNumber}
                    </Link>
                  </td>
                  <td>
                    <div style={{ fontSize: '14px', color: '#fff' }}>{inv.shipment.receiverName}</div>
                    <div style={{ fontSize: '12px', color: '#737373' }}>{inv.shipment.receiverCity}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>Rs {inv.totalAmount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${
                      inv.status === 'Paid' ? 'success' : 
                      inv.status === 'Void' ? 'neutral' : 'primary'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ color: '#a3a3a3', fontSize: '12px' }}>
                    {new Date(inv.issuedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Link href={`/admin/shipments/${inv.shipmentId}/waybill`} className="admin-link text-sm font-medium">
                      View Waybill
                    </Link>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#737373' }}>
                    No invoices found matching "{query}".
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
