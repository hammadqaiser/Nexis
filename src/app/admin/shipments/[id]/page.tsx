import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, Package, Truck, MapPin, CheckCircle, FileText } from "lucide-react";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function addTrackingEvent(formData: FormData) {
  "use server";
  const shipmentId = formData.get("shipmentId") as string;
  const status = formData.get("status") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;

  await prisma.$transaction([
    prisma.trackingEvent.create({
      data: {
        shipmentId,
        status,
        location,
        description
      }
    }),
    prisma.shipment.update({
      where: { id: shipmentId },
      data: { status }
    })
  ]);

  revalidatePath(`/admin/shipments/${shipmentId}`);
}

export default async function ShipmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedParams = await params;

  const shipment = await prisma.shipment.findUnique({
    where: { id: resolvedParams.id },
    include: { events: { orderBy: { timestamp: "desc" } } }
  });

  if (!shipment) {
    return (
      <div className="admin-content" style={{ textAlign: 'center', padding: '64px 0' }}>
        <h2>Shipment Not Found</h2>
        <Link href="/admin/shipments" className="admin-link">Return to Directory</Link>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/shipments" className="admin-btn-outline" style={{ display: 'inline-flex', padding: '8px 12px', fontSize: '14px', borderRadius: '8px', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Directory
        </Link>
      </div>

      <div className="admin-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ margin: 0 }}>{shipment.trackingNumber}</h1>
            <span className={`admin-badge ${
              shipment.status === 'Delivered' ? 'success' : 
              shipment.status === 'Booked' ? 'neutral' : 'primary'
            }`}>
              {shipment.status}
            </span>
          </div>
          <p style={{ marginTop: '4px' }}>Booked on {new Date(shipment.createdAt).toLocaleString()}</p>
        </div>
        <Link href={`/admin/shipments/${shipment.id}/waybill`} className="admin-btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <FileText size={16} /> Print Waybill
        </Link>
      </div>

      <div className="admin-details-grid">
        
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-card" style={{ padding: '32px' }}>
            <h2 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} style={{ color: '#3b82f6' }} /> Logistics Details
            </h2>
            <div className="admin-info-grid">
              <div>
                <p className="admin-info-label">Sender</p>
                <p className="admin-info-value">{shipment.senderName}</p>
                <p className="admin-info-sub">{shipment.senderPhone}</p>
                <p className="admin-info-sub">{shipment.senderAddress}, {shipment.senderCity}</p>
              </div>
              <div>
                <p className="admin-info-label">Receiver</p>
                <p className="admin-info-value">{shipment.receiverName}</p>
                <p className="admin-info-sub">{shipment.receiverPhone}</p>
                <p className="admin-info-sub">{shipment.receiverAddress}, {shipment.receiverCity}</p>
              </div>
            </div>
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #262626' }}>
              <div className="admin-info-grid">
                <div>
                  <p className="admin-info-label">Service Type</p>
                  <p className="admin-info-value">{shipment.serviceType}</p>
                </div>
                <div>
                  <p className="admin-info-label">Weight</p>
                  <p className="admin-info-value">{shipment.weight} kg</p>
                </div>
                <div>
                  <p className="admin-info-label">Shipping Fee</p>
                  <p className="admin-info-value">Rs {shipment.price}</p>
                </div>
                <div>
                  <p className="admin-info-label">COD Amount</p>
                  <p className="admin-info-value" style={{ color: shipment.isCOD ? '#10b981' : '#737373' }}>
                    {shipment.isCOD ? `Rs ${shipment.codAmount}` : "Not Applicable"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card" style={{ padding: '32px' }}>
            <h2 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} style={{ color: '#a855f7' }} /> Add Tracking Update
            </h2>
            {shipment.status === "Delivered" ? (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '8px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle size={20} /> Package has been successfully delivered. No further updates can be added.
              </div>
            ) : (
              <form action={addTrackingEvent}>
                <input type="hidden" name="shipmentId" value={shipment.id} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Update Status To</label>
                    <select required name="status" className="form-input" style={{ paddingLeft: '12px' }}>
                      <option value="In Transit">In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Current Location</label>
                    <input required type="text" name="location" className="form-input" style={{ paddingLeft: '12px' }} placeholder="e.g. Lahore Hub" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Status Description</label>
                  <input required type="text" name="description" className="form-input" style={{ paddingLeft: '12px' }} placeholder="Package has arrived at the sorting facility..." />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="admin-btn">Push Update to Timeline</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div>
          <div className="admin-card" style={{ padding: '32px', height: '100%' }}>
            <h2 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} style={{ color: '#eab308' }} /> Timeline History
            </h2>
            <div className="admin-timeline" style={{ marginTop: '24px' }}>
              {shipment.events.map((event, idx) => (
                <div key={event.id} className="admin-timeline-item">
                  {idx !== shipment.events.length - 1 && <div className="admin-timeline-line"></div>}
                  <div className={`admin-timeline-dot ${idx === 0 ? 'active' : 'inactive'}`}></div>
                  <div style={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', color: idx === 0 ? '#fff' : '#d4d4d4', fontWeight: 600 }}>{event.status}</h4>
                      <span style={{ fontSize: '12px', color: '#737373' }}>{new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#a3a3a3' }}>{event.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#737373' }}>
                      <MapPin size={12} /> {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
