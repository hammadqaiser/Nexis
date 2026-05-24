const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...')

  await prisma.trackingEvent.deleteMany()
  await prisma.shipment.deleteMany()
  await prisma.user.deleteMany()

  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@nexiscouriers.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log(`Created admin user: ${admin.email}`)

  const franchisePassword = await bcrypt.hash('franchise123', 10)
  const franchise = await prisma.user.create({
    data: {
      name: 'Islamabad I-10 Franchise',
      email: 'islamabad@nexiscouriers.com',
      password: franchisePassword,
      role: 'FRANCHISE',
      branchId: 'BR-ISL-01',
    },
  })
  console.log(`Created franchise user: ${franchise.email}`)

  const shipment = await prisma.shipment.create({
    data: {
      trackingNumber: 'NEX-987654321',
      senderName: 'Ali Khan',
      senderPhone: '03001234567',
      senderAddress: 'House 12, Street 5, F-8/4',
      senderCity: 'Islamabad',
      receiverName: 'Usman Tariq',
      receiverPhone: '03009876543',
      receiverAddress: 'Gulberg III',
      receiverCity: 'Lahore',
      weight: 1.5,
      serviceType: 'Overnight',
      price: 450,
      isCOD: true,
      codAmount: 2500,
      status: 'In Transit',
      events: {
        create: [
          {
            status: 'Booked',
            location: 'Islamabad Hub',
            description: 'Shipment booked and received at origin facility.',
          },
          {
            status: 'In Transit',
            location: 'Motorway',
            description: 'Shipment dispatched to destination hub.',
          },
        ],
      },
    },
  })
  console.log(`Created shipment: ${shipment.trackingNumber}`)

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
