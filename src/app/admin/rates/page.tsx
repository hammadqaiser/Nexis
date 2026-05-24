import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Calculator } from "lucide-react";
import { revalidatePath } from "next/cache";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function updateRates(formData: FormData) {
  "use server";
  
  const sameCityStandardBase = parseFloat(formData.get("sameCityStandardBase") as string);
  const sameCityExpressBase = parseFloat(formData.get("sameCityExpressBase") as string);
  const interCityStandardBase = parseFloat(formData.get("interCityStandardBase") as string);
  const interCityExpressBase = parseFloat(formData.get("interCityExpressBase") as string);

  const sameCityStandardKg = parseFloat(formData.get("sameCityStandardKg") as string);
  const sameCityExpressKg = parseFloat(formData.get("sameCityExpressKg") as string);
  const interCityStandardKg = parseFloat(formData.get("interCityStandardKg") as string);
  const interCityExpressKg = parseFloat(formData.get("interCityExpressKg") as string);

  const fuelSurchargePercent = parseFloat(formData.get("fuelSurchargePercent") as string);
  const taxPercent = parseFloat(formData.get("taxPercent") as string);

  await prisma.rateCard.upsert({
    where: { id: "global_rates" },
    update: {
      sameCityStandardBase, sameCityExpressBase, interCityStandardBase, interCityExpressBase,
      sameCityStandardKg, sameCityExpressKg, interCityStandardKg, interCityExpressKg,
      fuelSurchargePercent, taxPercent
    },
    create: {
      id: "global_rates",
      sameCityStandardBase, sameCityExpressBase, interCityStandardBase, interCityExpressBase,
      sameCityStandardKg, sameCityExpressKg, interCityStandardKg, interCityExpressKg,
      fuelSurchargePercent, taxPercent
    }
  });

  revalidatePath('/admin/rates');
}

export default async function AdminRatesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/admin/login");

  let rates = await prisma.rateCard.findUnique({
    where: { id: "global_rates" }
  });

  if (!rates) {
    rates = {
      id: "global_rates",
      sameCityStandardBase: 180,
      sameCityExpressBase: 280,
      interCityStandardBase: 320,
      interCityExpressBase: 450,
      sameCityStandardKg: 60,
      sameCityExpressKg: 100,
      interCityStandardKg: 120,
      interCityExpressKg: 180,
      fuelSurchargePercent: 10,
      taxPercent: 16,
      updatedAt: new Date()
    };
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calculator size={28} style={{ color: '#8b5cf6' }} /> Delivery Rates Configuration
          </h1>
          <p>Update base rates and per-kg surcharges globally. Changes apply immediately to the public rate calculator.</p>
        </div>
      </div>

      <div className="admin-card">
        <form action={updateRates} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div>
            <h2 className="admin-section-title">Base Rates (First 1 KG)</h2>
            <div className="admin-form-grid">
              <div>
                <div className="form-group">
                  <label className="form-label">Same City - Overland (Rs)</label>
                  <input type="number" name="sameCityStandardBase" defaultValue={rates.sameCityStandardBase} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Same City - Air Express (Rs)</label>
                  <input type="number" name="sameCityExpressBase" defaultValue={rates.sameCityExpressBase} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label className="form-label">Inter City - Overland (Rs)</label>
                  <input type="number" name="interCityStandardBase" defaultValue={rates.interCityStandardBase} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Inter City - Air Express (Rs)</label>
                  <input type="number" name="interCityExpressBase" defaultValue={rates.interCityExpressBase} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="admin-section-title">Additional Weight Surcharge (Per Extra KG)</h2>
            <div className="admin-form-grid">
              <div>
                <div className="form-group">
                  <label className="form-label">Same City - Overland (Rs)</label>
                  <input type="number" name="sameCityStandardKg" defaultValue={rates.sameCityStandardKg} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Same City - Air Express (Rs)</label>
                  <input type="number" name="sameCityExpressKg" defaultValue={rates.sameCityExpressKg} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label className="form-label">Inter City - Overland (Rs)</label>
                  <input type="number" name="interCityStandardKg" defaultValue={rates.interCityStandardKg} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Inter City - Air Express (Rs)</label>
                  <input type="number" name="interCityExpressKg" defaultValue={rates.interCityExpressKg} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="admin-section-title">Global Adjustments</h2>
            <div className="admin-form-grid">
              <div>
                <div className="form-group">
                  <label className="form-label">Fuel Surcharge (%)</label>
                  <input type="number" name="fuelSurchargePercent" defaultValue={rates.fuelSurchargePercent} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
              </div>
              <div>
                <div className="form-group">
                  <label className="form-label">Government Tax GST (%)</label>
                  <input type="number" name="taxPercent" defaultValue={rates.taxPercent} required className="form-input" style={{ paddingLeft: '12px' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn">Save Configuration</button>
          </div>
        </form>
      </div>
    </div>
  );
}
