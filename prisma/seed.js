import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Clean up existing data to ensure a fresh start
  console.log('Deleting existing data...');
  // The order of deletion is important to avoid foreign key constraint errors
  await prisma.inventoryMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  console.log('Existing data deleted.');

  // 2. Create an Admin User and a Regular User
  console.log('Creating users...');
  const salt = await bcrypt.genSalt(10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@inventory.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@inventory.com',
      password: await bcrypt.hash('adminpassword', salt),
      role: 'ADMIN',
      isVerified: true, // Auto-verify seed users for easy testing
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@inventory.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@inventory.com',
      password: await bcrypt.hash('userpassword', salt),
      role: 'USER',
      isVerified: true,
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);
  console.log(`Created regular user: ${regularUser.email}`);

  // 3. Create Categories
  console.log('Creating categories...');
  const electronics = await prisma.category.create({
    data: { name: 'Electronics' },
  });
  const officeSupplies = await prisma.category.create({
    data: { name: 'Office Supplies' },
  });
  console.log('Created categories: Electronics, Office Supplies');

  // 4. Create Suppliers
  console.log('Creating suppliers...');
  const techSupplier = await prisma.supplier.create({
    data: {
      name: 'Global Tech Inc.',
      contactName: 'Jane Doe',
      contactEmail: 'jane.doe@globaltech.com',
      contactPhone: '111-222-3333',
    },
  });
  const officeSupplier = await prisma.supplier.create({
    data: {
      name: 'Office Essentials Ltd.',
      contactName: 'John Smith',
      contactEmail: 'john.smith@officeessentials.com',
      contactPhone: '444-555-6666',
    },
  });
  console.log('Created suppliers: Global Tech Inc., Office Essentials Ltd.');

  // 5. Create Products and link them to Categories and Suppliers
  console.log('Creating products...');
  await prisma.product.create({
    data: {
      name: '14" Laptop Pro',
      sku: 'LP-PRO-14-2025',
      description: 'High-performance laptop for professionals.',
      quantity: 50,
      price: 1499.99,
      categoryId: electronics.id,
      supplierId: techSupplier.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Wireless Ergonomic Mouse',
      sku: 'MSE-ERGO-WL-25',
      description: 'Comfortable mouse for all-day use.',
      quantity: 200,
      price: 79.99,
      categoryId: electronics.id,
      supplierId: techSupplier.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'A4 Printer Paper (500 Sheets)',
      sku: 'PPR-A4-500S',
      description: 'High-quality paper for all office printers.',
      quantity: 1000,
      price: 9.99,
      categoryId: officeSupplies.id,
      supplierId: officeSupplier.id,
    },
  });
  console.log('Created 3 products.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });