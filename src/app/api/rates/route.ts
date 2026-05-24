import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    let rateCard = await prisma.rateCard.findUnique({
      where: { id: 'global_rates' }
    });

    if (!rateCard) {
      // Fallback if not seeded yet
      rateCard = {
        id: 'global_rates',
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
        updatedAt: new Date(),
      };
    }

    return NextResponse.json(rateCard);
  } catch (error) {
    console.error('Failed to fetch rates:', error);
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}
