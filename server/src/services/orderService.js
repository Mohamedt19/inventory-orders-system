import prisma from "../prisma/client.js";

export async function createOrder(data) {
  const type = data.type ?? "sale";
  const status = data.status ?? "pending";
  const productIds = data.items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  const orderItemsData = data.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      const err = new Error(`Product ${item.productId} not found`);
      err.statusCode = 404;
      throw err;
    }

    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.price,
    };
  });

  const total = orderItemsData.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return prisma.order.create({
    data: {
      type,
      status,
      total,
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}

export function findOrders() {
  return prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function findOrderById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}

export async function updateOrder(id, data) {
  const existing = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!existing) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  const nextStatus = data.status ?? existing.status;

  if (existing.status === "completed" && nextStatus !== "completed") {
    const err = new Error("Completed orders cannot be changed");
    err.statusCode = 400;
    throw err;
  }

  if (existing.status === "cancelled" && nextStatus !== "cancelled") {
    const err = new Error("Cancelled orders cannot be changed");
    err.statusCode = 400;
    throw err;
  }

  return prisma.$transaction(async (tx) => {
    const isMovingToCompleted =
      existing.status !== "completed" && nextStatus === "completed";

    if (isMovingToCompleted) {
      if (existing.type === "sale") {
        for (const item of existing.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            const err = new Error(`Product ${item.productId} not found`);
            err.statusCode = 404;
            throw err;
          }

          if (product.stock < item.quantity) {
            const err = new Error(
              `Not enough stock for ${product.name}. Available: ${product.stock}, required: ${item.quantity}`
            );
            err.statusCode = 400;
            throw err;
          }
        }

        for (const item of existing.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      if (existing.type === "purchase") {
        for (const item of existing.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }
    }

    const updatedOrder = await tx.order.update({
      where: { id },
      data,
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return updatedOrder;
  });
}

export async function deleteOrder(id) {
  const existing = await prisma.order.findUnique({ where: { id } });

  if (!existing) {
    const err = new Error("Order not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.order.delete({ where: { id } });
}