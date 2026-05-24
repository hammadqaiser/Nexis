import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function createShipment(formData: FormData) {
  "use server";
  
  const senderName = formData.get("senderName") as string;
  const senderPhone = formData.get("senderPhone") as string;
  const senderAddress = formData.get("senderAddress") as string;
  const senderCity = formData.get("senderCity") as string;
  
  const receiverName = formData.get("receiverName") as string;
  const receiverPhone = formData.get("receiverPhone") as string;
  const receiverAddress = formData.get("receiverAddress") as string;
  const receiverCity = formData.get("receiverCity") as string;
  
  const weight = parseFloat(formData.get("weight") as string);
  const serviceType = formData.get("serviceType") as string;
  const isCOD = formData.get("isCOD") === "on";
  const codAmount = isCOD ? parseFloat(formData.get("codAmount") as string) : null;
  const price = parseFloat(formData.get("price") as string);

  const origin = formData.get("origin") as string;
  const destination = formData.get("destination") as string;
  const instructions = formData.get("instructions") as string;
  const pieces = parseInt(formData.get("pieces") as string) || 1;
  const dimensions = formData.get("dimensions") as string;
  const insuranceValueRaw = formData.get("insuranceValue");
  const insuranceValue = insuranceValueRaw ? parseFloat(insuranceValueRaw as string) : null;

  // Generate Tracking Number
  const randomStr = Math.floor(10000000 + Math.random() * 90000000);
  const trackingNumber = `NEX-${randomStr}`;

  const shipment = await prisma.shipment.create({
    data: {
      trackingNumber,
      senderName,
      senderPhone,
      senderAddress,
      senderCity,
      receiverName,
      receiverPhone,
      receiverAddress,
      receiverCity,
      origin,
      destination,
      instructions,
      pieces,
      dimensions,
      insuranceValue,
      weight,
      serviceType,
      isCOD,
      codAmount,
      price,
      status: "Booked",
      events: {
        create: [
          {
            status: "Booked",
            location: senderCity,
            description: "Shipment booked and received at origin facility."
          }
        ]
      },
      invoice: {
        create: {
          invoiceNumber: `INV-${randomStr}`,
          weightCharges: price,
          taxAmount: price * 0.16, // 16% GST
          totalAmount: price + (price * 0.16)
        }
      }
    }
  });

  revalidatePath("/admin/shipments");
  redirect(`/admin/shipments/${shipment.id}`);
}

export default async function NewShipmentPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
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
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PackagePlus size={28} style={{ color: '#3b82f6' }} /> Book New Shipment
          </h1>
          <p>Register a new package into the network</p>
        </div>
      </div>

      <div className="admin-card">
        <form action={createShipment}>
          <div className="admin-form-grid">
            
            {/* Sender Details */}
            <div>
              <h2 className="admin-section-title">Sender Details</h2>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required type="text" name="senderName" className="form-input" style={{ paddingLeft: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input required type="tel" name="senderPhone" className="form-input" style={{ paddingLeft: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input required type="text" name="senderCity" className="form-input" style={{ paddingLeft: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Complete Address</label>
                <textarea required name="senderAddress" className="form-input" style={{ paddingLeft: '12px' }}></textarea>
              </div>
            </div>

            {/* Receiver Details */}
            <div>
              <h2 className="admin-section-title">Receiver Details</h2>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required type="text" name="receiverName" className="form-input" style={{ paddingLeft: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input required type="tel" name="receiverPhone" className="form-input" style={{ paddingLeft: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input required type="text" name="receiverCity" className="form-input" style={{ paddingLeft: '12px' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Complete Address</label>
                <textarea required name="receiverAddress" className="form-input" style={{ paddingLeft: '12px' }}></textarea>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '32px' }}>
            <h2 className="admin-section-title">Package & Logistics</h2>
            <div className="admin-form-grid">
              <div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input required type="number" step="0.1" name="weight" className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Service Type</label>
                  <select required name="serviceType" className="form-input" style={{ paddingLeft: '12px' }}>
                    <option value="Overnight">Overnight Express</option>
                    <option value="Standard">Standard Delivery</option>
                    <option value="Same Day">Same Day (City-to-City)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <div className="form-group">
                  <label className="form-label">Total Price (Shipping Fees)</label>
                  <input required type="number" name="price" className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
                  <input type="checkbox" id="isCOD" name="isCOD" style={{ width: '18px', height: '18px' }} />
                  <label htmlFor="isCOD" className="form-label" style={{ marginBottom: 0 }}>Is this a Cash on Delivery (COD) shipment?</label>
                </div>
                <div className="form-group">
                  <label className="form-label">COD Amount (Leave blank if not COD)</label>
                  <input type="number" name="codAmount" className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h2 className="admin-section-title">Waybill Instructions (Optional)</h2>
            <div className="admin-form-grid">
              <div>
                <div className="form-group">
                  <label className="form-label">Origin Code (e.g. ISB)</label>
                  <input type="text" name="origin" defaultValue="ISB" className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Destination Code (e.g. UK)</label>
                  <input type="text" name="destination" defaultValue="LHE" className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Special Instructions (Commodity)</label>
                  <textarea name="instructions" className="form-input" style={{ paddingLeft: '12px' }} placeholder="03 WOMEN DRESSES..."></textarea>
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label className="form-label">Number of Pieces</label>
                  <input type="number" name="pieces" defaultValue="1" min="1" className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dimensions (LxWxH)</label>
                  <input type="text" name="dimensions" className="form-input" style={{ paddingLeft: '12px' }} placeholder="10x20x15 cm" />
                </div>
                <div className="form-group">
                  <label className="form-label">Insurance Value (Rs)</label>
                  <input type="number" name="insuranceValue" className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-form-actions">
            <Link href="/admin/shipments" className="admin-btn-outline" style={{ padding: '12px 24px', textDecoration: 'none', borderRadius: '8px' }}>
              Cancel
            </Link>
            <button type="submit" className="admin-btn" style={{ padding: '12px 32px' }}>
              Confirm & Book Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
