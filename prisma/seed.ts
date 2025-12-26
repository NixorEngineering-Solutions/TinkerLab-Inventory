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
  console.log('Seeding Inventory Items...')

  await prisma.item.deleteMany({}) 

  // const items = [
  //   { name: 'Arduino Uno R3', quantity: 20, price: 25.00 },
  //   { name: 'Raspberry Pi 4 (4GB)', quantity: 8, price: 55.00 },
  //   { name: 'Servo Motor (SG90)', quantity: 50, price: 2.50 },
  //   { name: 'Breadboard (Large)', quantity: 30, price: 5.00 },
  //   { name: 'Ultrasonic Sensor (HC-SR04)', quantity: 15, price: 3.50 },
  //   { name: 'Jumper Wires (Pack)', quantity: 100, price: 4.00 },
  //   { name: 'Digital Multimeter', quantity: 5, price: 15.00 },
  //   { name: 'Soldering Iron Kit', quantity: 4, price: 22.00 },
  //   { name: 'DC Motor (3V-6V)', quantity: 40, price: 1.50 },
  //   { name: '9V Battery Snap', quantity: 25, price: 0.50 },
  //   { name: 'LED Pack (Red/Green/Yellow)', quantity: 200, price: 10.00 },
  //   { name: '3D Printer Filament (PLA White)', quantity: 10, price: 24.00 },
  // ]
  const items = [
    { name: 'Arduino Uno R3 smd', quantity:  15, price: 0 },
    { name: 'Bread boards', quantity:  15, price: 0 },
    { name: 'Dual Battery box', quantity: 5, price: 0 },
    { name: 'digital multimeter', quantity: 2, price: 0 },
    { name: 'soldering iron', quantity: 1, price: 0 },
    { name: 'screwdrivers', quantity: 5, price: 0 },
    { name: 'soldering wire', quantity: 3, price: 0 },
    { name: 'screw driver set', quantity: 2, price: 0 },
    { name: 'hammer', quantity: 1, price: 0 },
    { name: 'AC/DC ADAPTER 5V 2AMPS', quantity: 2, price: 0 },
    { name: '12v 2.5 amps ac/dc adapter', quantity: 3, price: 0 },
    { name: 'soldering flux paste', quantity: 8, price: 0 },
    { name: 'plier', quantity: 1, price: 0 },
    { name: 'wire stripping tool', quantity: 1, price: 0 },
    { name: 'desoldering pump', quantity: 1, price: 0 },
    { name: '9v batteries', quantity: 10, price: 0 },
    { name: 'diodes', quantity: 25, price: 0 },
    { name: 'lithium ion batteries', quantity: 18, price: 0 },
    { name: 'glove pairs', quantity: 2, price: 0 },
    { name: 'Saftey Goggles', quantity: 10, price: 0 },
    { name: 'LEDs white', quantity: 50, price: 0 },
    { name: 'red LEDS', quantity: 52, price: 0 },
    { name: 'green LEDS', quantity: 52, price: 0 },
    { name: '1000 microF Capacitors', quantity: 9, price: 0 },
    { name: '100 microF capacitors', quantity: 10, price: 0 },
    { name: 'neon LEDS', quantity: 47, price: 0 },
    { name: 'bc557 Transistors', quantity: 25, price: 0 },
    { name: 'bc547 transistors', quantity: 25, price: 0 },
    { name: 'orange LEDS', quantity: 67, price: 0 },
    { name: 'male-male jumper wires', quantity: 10, price: 0 },
    { name: 'male-female jumper wires', quantity: 10, price: 0 },
    { name: 'zero pcb', quantity: 3, price: 0 },
    { name: '4-cell Battery Charger', quantity: 2, price: 0 },
    { name: '2n2222 transistors', quantity: 25, price: 0 },
    { name: '1N4007 diodes', quantity: 50, price: 0 },
    { name: '1N 4148 diodes', quantity: 50, price: 0 },
    { name: '0.1microF Capacitors', quantity: 47, price: 0 },
    { name: '10 microF capacitors', quantity: 19, price: 0 },
    { name: 'glueguns', quantity: 2, price: 0 },
    { name: 'Tactical button', quantity: 10, price: 0 },
    { name: 'small tactical button', quantity: 10, price: 0 },
    { name: 'Switches', quantity: 30, price: 0 },
    { name: 'RC car Kit', quantity: 2, price: 0 },
    { name: 'L298N Motor Driver', quantity: 5, price: 0 },
    { name: 'Servo Motor sg90', quantity: 10	, price: 0 },
    { name: '1 ohm', quantity: 30, price: 0 },
    { name: '1.2 ohm', quantity: 30, price: 0 },
    { name: '1.5 ohm', quantity: 30, price: 0 },
    { name: '2.2 ohm', quantity: 30, price: 0 },
    { name: '2.7 ohm', quantity: 30, price: 0 },
    { name: '3.3 ohm', quantity: 30, price: 0 },
    { name: '3.9 ohm', quantity: 30, price: 0 },
    { name: '4.7 ohm', quantity: 30, price: 0 },
    { name: '5.6 ohm', quantity: 30, price: 0 },
    { name: '6.8 ohm', quantity: 30, price: 0 },
    { name: '8.2 ohm', quantity: 30, price: 0 },
    { name: '10 ohm', quantity: 30, price: 0 },
    { name: '12 ohm', quantity: 30, price: 0 },
    { name: '15 ohm', quantity: 30, price: 0 },
    { name: '22 ohm', quantity: 30, price: 0 },
    { name: '27 ohm', quantity: 30, price: 0 },
    { name: '33 ohm', quantity: 30, price: 0 },
    { name: '39 ohm', quantity: 30, price: 0 },
    { name: '47 ohm', quantity: 30, price: 0 },
    { name: '56 ohm', quantity: 30, price: 0 },
    { name: '68 ohm', quantity: 30, price: 0 },
    { name: '82 ohm', quantity: 30, price: 0 },
    { name: '100 ohm', quantity: 30, price: 0 },
    { name: '120 ohm', quantity: 30, price: 0 },
    { name: '150 ohm', quantity: 30, price: 0 },
    { name: '220 ohm', quantity: 30, price: 0 },
    { name: '270 ohm', quantity: 30, price: 0 },
    { name: '330 ohm', quantity: 30, price: 0 },
    { name: '390 ohm', quantity: 30, price: 0 },
    { name: '470 ohm', quantity: 30, price: 0 },
    { name: '560 ohm', quantity: 30, price: 0 },
    { name: '680 ohm', quantity: 30, price: 0 },
    { name: '820 ohm', quantity: 30, price: 0 },
    { name: '1K ohm', quantity: 30, price: 0 },
    { name: '1.2K ohm', quantity: 30, price: 0 },
    { name: '1.5K ohm', quantity: 30, price: 0 },
    { name: '2.2K ohm', quantity: 30, price: 0 },
    { name: '2.7K ohm', quantity: 30, price: 0 },
    { name: '3.3K ohm', quantity: 30, price: 0 },
    { name: '3.9K ohm', quantity: 30, price: 0 },
    { name: '4.7K ohm', quantity: 30, price: 0 },
    { name: '5.6K ohm', quantity: 30, price: 0 },
    { name: '6.8K ohm', quantity: 30, price: 0 },
    { name: '8.2K ohm', quantity: 30, price: 0 },
    { name: '10K ohm', quantity: 30, price: 0 },
    { name: '12K ohm', quantity: 30, price: 0 },
    { name: '15K ohm', quantity: 30, price: 0 },
    { name: '22K ohm', quantity: 30, price: 0 },
    { name: '27K ohm', quantity: 30, price: 0 },
    { name: '33K ohm', quantity: 30, price: 0 },
    { name: '39K ohm', quantity: 30, price: 0 },
    { name: '47K ohm', quantity: 30, price: 0 },
    { name: '56K ohm', quantity: 30, price: 0 },
    { name: '68K ohm', quantity: 30, price: 0 },
    { name: '82K ohm', quantity: 30, price: 0 },
    { name: '100K ohm', quantity: 30, price: 0 },
    { name: '120K ohm', quantity: 30, price: 0 },
    { name: '150K ohm', quantity: 30, price: 0 },
    { name: '220K ohm', quantity: 30, price: 0 },
    { name: '270K ohm', quantity: 30, price: 0 },
    { name: '330K ohm', quantity: 30, price: 0 },
    { name: '390K ohm', quantity: 30, price: 0 },
    { name: '470K ohm', quantity: 30, price: 0 },
    { name: '560K ohm', quantity: 30, price: 0 },
    { name: '680K ohm', quantity: 30, price: 0 },
    { name: '820K ohm', quantity: 30, price: 0 },
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

  console.log(`Successfully added ${items.length} items to inventory.`)
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

