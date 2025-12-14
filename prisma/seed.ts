import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('potatoestypeshi', 10)

  const admin = await prisma.users.upsert({
    where: { student_id: '20260760' },
    update: {}, 
    create: {
      barcode: '00000000', 
      student_id: '20260760',
      student_name: 'Shaham Aftab',
      password: hashedPassword,
      role: Role.ADMIN,
      verified: true,
    },
  })

  console.log({ admin })
  console.log('🌱 Seeding Inventory Items...')

  await prisma.item.deleteMany({}) 

  const items = [
    { name: 'Arduino Uno R3', quantity: 20, price: 25.00 },
    { name: 'Raspberry Pi 4 (4GB)', quantity: 8, price: 55.00 },
    { name: 'Servo Motor (SG90)', quantity: 50, price: 2.50 },
    { name: 'Breadboard (Large)', quantity: 30, price: 5.00 },
    { name: 'Ultrasonic Sensor (HC-SR04)', quantity: 15, price: 3.50 },
    { name: 'Jumper Wires (Pack)', quantity: 100, price: 4.00 },
    { name: 'Digital Multimeter', quantity: 5, price: 15.00 },
    { name: 'Soldering Iron Kit', quantity: 4, price: 22.00 },
    { name: 'DC Motor (3V-6V)', quantity: 40, price: 1.50 },
    { name: '9V Battery Snap', quantity: 25, price: 0.50 },
    { name: 'LED Pack (Red/Green/Yellow)', quantity: 200, price: 10.00 },
    { name: '3D Printer Filament (PLA White)', quantity: 10, price: 24.00 },
  ]

  for (const item of items) {
    await prisma.item.create({
      data: {
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        available: true
      }
    })
  }

  console.log(`✅ Successfully added ${items.length} items to inventory.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

