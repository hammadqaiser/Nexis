import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Waybill from "@/components/admin/Waybill";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "@/components/admin/PrintButton";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function PrintableWaybillPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const resolvedParams = await params;

  const shipment = await prisma.shipment.findUnique({
    where: { id: resolvedParams.id },
    include: { invoice: true }
  });

  if (!shipment) {
    return <div>Shipment Not Found</div>;
  }

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '24px' }}>
      <div className="no-print" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Link href={`/admin/shipments/${shipment.id}`} className="admin-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', color: '#000', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', border: '1px solid #ccc' }}>
          <ArrowLeft size={16} /> Back to Shipment
        </Link>
        <PrintButton />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: #fff !important; }
          .no-print { display: none !important; }
          main { margin-top: 0 !important; }
          header, footer { display: none !important; }
          @page { margin: 0; }
        }
      `}} />

      <Waybill shipment={shipment as any} />
    </div>
  );
}
