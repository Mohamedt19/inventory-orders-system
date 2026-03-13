import prisma from "../prisma/client.js";

export async function getDashboardSummary() {
  const [totalProducts, lowStockProducts, totalOrders, pendingOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 5 } } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } })
    ]);

  return {
    totalProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders
  };
}