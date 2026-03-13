import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding inventory_orders_db...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  await Promise.all([
    prisma.user.create({
      data: {
        name: "Mohamed",
        email: "mohamed@example.com",
        password: passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Sara",
        email: "sara@example.com",
        password: passwordHash,
      },
    }),
  ]);

  const [techSupply, officeHub, globalParts, quickWholesale] =
    await Promise.all([
      prisma.supplier.create({
        data: {
          name: "Tech Supply Co",
          email: "sales@techsupply.com",
          phone: "555-1001",
        },
      }),
      prisma.supplier.create({
        data: {
          name: "Office Hub",
          email: "orders@officehub.com",
          phone: "555-1002",
        },
      }),
      prisma.supplier.create({
        data: {
          name: "Global Parts Ltd",
          email: "contact@globalparts.com",
          phone: "555-1003",
        },
      }),
      prisma.supplier.create({
        data: {
          name: "Quick Wholesale",
          email: "support@quickwholesale.com",
          phone: "555-1004",
        },
      }),
    ]);

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Wireless Mouse",
        sku: "WM-1001",
        price: 24.99,
        stock: 18,
        supplierId: techSupply.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Mechanical Keyboard",
        sku: "MK-2001",
        price: 79.99,
        stock: 7,
        supplierId: techSupply.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "27-inch Monitor",
        sku: "MN-3001",
        price: 219.99,
        stock: 4,
        supplierId: globalParts.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "USB-C Dock",
        sku: "DK-4001",
        price: 129.99,
        stock: 6,
        supplierId: globalParts.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Office Chair",
        sku: "OC-5001",
        price: 159.99,
        stock: 3,
        supplierId: officeHub.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Standing Desk",
        sku: "SD-6001",
        price: 349.99,
        stock: 2,
        supplierId: officeHub.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Notebook Pack",
        sku: "NB-7001",
        price: 12.5,
        stock: 40,
        supplierId: quickWholesale.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Printer Paper Box",
        sku: "PP-8001",
        price: 34.0,
        stock: 22,
        supplierId: quickWholesale.id,
      },
    }),
  ]);

  const bySku = Object.fromEntries(products.map((p) => [p.sku, p]));

  async function createOrder({ type, status, items }) {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    return prisma.order.create({
      data: {
        type,
        status,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  await Promise.all([
    createOrder({
      type: "sale",
      status: "pending",
      items: [
        {
          productId: bySku["WM-1001"].id,
          quantity: 3,
          unitPrice: bySku["WM-1001"].price,
        },
        {
          productId: bySku["MK-2001"].id,
          quantity: 2,
          unitPrice: bySku["MK-2001"].price,
        },
      ],
    }),
    createOrder({
      type: "sale",
      status: "completed",
      items: [
        {
          productId: bySku["MN-3001"].id,
          quantity: 2,
          unitPrice: bySku["MN-3001"].price,
        },
        {
          productId: bySku["DK-4001"].id,
          quantity: 2,
          unitPrice: bySku["DK-4001"].price,
        },
      ],
    }),
    createOrder({
      type: "purchase",
      status: "pending",
      items: [
        {
          productId: bySku["OC-5001"].id,
          quantity: 5,
          unitPrice: bySku["OC-5001"].price,
        },
        {
          productId: bySku["SD-6001"].id,
          quantity: 3,
          unitPrice: bySku["SD-6001"].price,
        },
      ],
    }),
    createOrder({
      type: "purchase",
      status: "completed",
      items: [
        {
          productId: bySku["NB-7001"].id,
          quantity: 10,
          unitPrice: bySku["NB-7001"].price,
        },
        {
          productId: bySku["PP-8001"].id,
          quantity: 8,
          unitPrice: bySku["PP-8001"].price,
        },
      ],
    }),
    createOrder({
      type: "sale",
      status: "cancelled",
      items: [
        {
          productId: bySku["WM-1001"].id,
          quantity: 5,
          unitPrice: bySku["WM-1001"].price,
        },
        {
          productId: bySku["PP-8001"].id,
          quantity: 3,
          unitPrice: bySku["PP-8001"].price,
        },
      ],
    }),
  ]);

  console.log("Seed completed.");
  console.log("Demo users:");
  console.log("mohamed@example.com / 123456");
  console.log("sara@example.com / 123456");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });