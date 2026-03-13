import prisma from "../prisma/client.js";

export function createProduct(data) {
  return prisma.product.create({
    data: {
      name: data.name,
      sku: data.sku,
      price: data.price,
      stock: data.stock,
      supplierId: data.supplierId ?? null
    },
    include: { supplier: true }
  });
}

export function findProducts() {
  return prisma.product.findMany({
    include: { supplier: true },
    orderBy: { createdAt: "desc" }
  });
}

export function findProductById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: { supplier: true }
  });
}

export async function updateProduct(id, data) {
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      supplierId: data.supplierId ?? undefined
    },
    include: { supplier: true }
  });
}

export async function deleteProduct(id) {
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.product.delete({ where: { id } });
}