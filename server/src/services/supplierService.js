import prisma from "../prisma/client.js";

export function createSupplier(data) {
  return prisma.supplier.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null
    }
  });
}

export function findSuppliers() {
  return prisma.supplier.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export function findSupplierById(id) {
  return prisma.supplier.findUnique({
    where: { id },
    include: { products: true }
  });
}

export async function updateSupplier(id, data) {
  const existing = await prisma.supplier.findUnique({ where: { id } });

  if (!existing) {
    const err = new Error("Supplier not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.supplier.update({
    where: { id },
    data: {
      ...data,
      email: data.email === "" ? null : data.email,
      phone: data.phone === "" ? null : data.phone
    }
  });
}

export async function deleteSupplier(id) {
  const existing = await prisma.supplier.findUnique({ where: { id } });

  if (!existing) {
    const err = new Error("Supplier not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.supplier.delete({ where: { id } });
}