// prisma/seed.ts
import { PrismaClient, UserRole, Language, TimeSlot, BookingStatus, PaymentMethod, PaymentType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: UserRole.ADMIN,
      language: Language.AR,
    },
  })
  console.log('Admin user created:', admin.username)

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 12)
  const staff = await prisma.user.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      password: staffPassword,
      role: UserRole.STAFF,
      language: Language.EN,
    },
  })
  console.log('Staff user created:', staff.username)

  // Create sample clients
  const client1 = await prisma.client.upsert({
    where: { email: 'sarah@email.com' },
    update: {},
    create: {
      fullName: 'Sarah & John Smith',
      email: 'sarah@email.com',
      phoneNumber: '(555) 123-4567',
      guestCount: 150,
      notes: 'Vegetarian preferences',
    },
  })

  const client2 = await prisma.client.upsert({
    where: { email: 'emily@email.com' },
    update: {},
    create: {
      fullName: 'Emily & Michael Johnson',
      email: 'emily@email.com',
      phoneNumber: '(555) 987-6543',
      guestCount: 200,
      notes: 'Outdoor ceremony preferred',
    },
  })
  console.log('Sample clients created')

  // Create sample bookings
  const booking1 = await prisma.booking.create({
    data: {
      title: 'Sarah & John Wedding',
      clientId: client1.id,
      date: new Date('2024-06-15'),
      timeSlot: TimeSlot.EVENING,
      status: BookingStatus.CONFIRMED,
      totalPrice: 800000, // 800,000 DZD
      paidAmount: 400000, // 400,000 DZD
      notes: 'Vegetarian menu options needed',
      userId: admin.id,
    },
  })

  const booking2 = await prisma.booking.create({
    data: {
      title: 'Emily & Michael Wedding',
      clientId: client2.id,
      date: new Date('2024-07-20'),
      timeSlot: TimeSlot.EVENING,
      status: BookingStatus.DEPOSIT_PAID,
      totalPrice: 1200000, // 1,200,000 DZD
      paidAmount: 300000, // 300,000 DZD
      notes: 'Outdoor ceremony preferred',
      userId: staff.id,
    },
  })
  console.log('Sample bookings created')

  // Create sample payments
  const payment1 = await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      staffId: admin.id,
      amount: 400000,
      method: PaymentMethod.CASH,
      type: PaymentType.DEPOSIT,
      notes: 'Initial deposit payment',
    },
  })

  const payment2 = await prisma.payment.create({
    data: {
      bookingId: booking2.id,
      staffId: staff.id,
      amount: 300000,
      method: PaymentMethod.BANK_TRANSFER,
      type: PaymentType.DEPOSIT,
      notes: 'Bank transfer deposit',
    },
  })
  console.log('Sample payments created')

  // Create pricing seasons
  const summerSeason = await prisma.pricingSeason.create({
    data: {
      name: 'Summer 2024',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      morningPrice: 400000,
      eveningPrice: 800000,
      isActive: true,
    },
  })

  const winterSeason = await prisma.pricingSeason.create({
    data: {
      name: 'Winter 2024',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-02-28'),
      morningPrice: 300000,
      eveningPrice: 600000,
      isActive: true,
    },
  })
  console.log('Sample pricing seasons created')

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