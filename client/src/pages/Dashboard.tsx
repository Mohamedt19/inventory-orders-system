import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import type { DashboardSummary, Order, Product } from "../types";

function MetricCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 border-l-4 bg-white p-3 shadow-sm ${accent}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </div>
      <div className="mt-2 text-[32px] font-bold leading-none tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-700",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
        styles[status] ?? "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function OrderTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    purchase: "border-cyan-200 bg-cyan-50 text-cyan-700",
    sale: "border-violet-200 bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
        styles[type] ?? "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {type}
    </span>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    Promise.all([
      apiRequest<DashboardSummary>("/api/dashboard/summary"),
      apiRequest<Product[]>("/api/products"),
      apiRequest<Order[]>("/api/orders"),
    ])
      .then(([summaryData, productData, orderData]) => {
        setSummary(summaryData);
        setProducts(productData);
        setOrders(orderData);
      })
      .catch(console.error);
  }, []);

  if (!summary) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const lowStockProducts = products
    .filter((product) => product.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        Inventory Overview
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Products"
          value={summary.totalProducts}
          accent="border-l-slate-700"
        />
        <MetricCard
          title="Low Stock"
          value={summary.lowStockProducts}
          accent="border-l-amber-500"
        />
        <MetricCard
          title="Total Orders"
          value={summary.totalOrders}
          accent="border-l-teal-500"
        />
        <MetricCard
          title="Pending Orders"
          value={summary.pendingOrders}
          accent="border-l-blue-500"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Low Stock Watch
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Products that need restocking attention.
            </p>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="px-5 py-6 text-sm text-slate-500">
              No low-stock products right now.
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1fr_1.3fr] bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <div>Product</div>
                <div>SKU</div>
                <div>Stock</div>
                <div>Supplier</div>
              </div>

              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1.3fr] items-center border-t border-slate-200 px-5 py-3 text-sm"
                >
                  <div className="font-medium text-slate-900">
                    {product.name}
                  </div>
                  <div className="text-slate-500">{product.sku}</div>
                  <div>
                    <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      {product.stock} low
                    </span>
                  </div>
                  <div className="text-slate-600">
                    {product.supplier?.name || "No supplier"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              System Status
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Quick monitoring view of stock and order flow.
            </p>
          </div>

          <div className="space-y-3 px-5 py-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-sm text-slate-500">Stock health</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">
                {summary.lowStockProducts === 0 ? "Stable" : "Needs attention"}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-sm text-slate-500">Open orders</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">
                {summary.pendingOrders} active
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-sm text-slate-500">Tracked products</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">
                {summary.totalProducts} SKUs
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest order activity across purchase and sales flows.
          </p>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-6 text-sm text-slate-500">
            No recent orders.
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.2fr] bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <div>Order</div>
              <div>Type</div>
              <div>Status</div>
              <div>Total</div>
              <div>Date</div>
            </div>

            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_1.2fr] items-center border-t border-slate-200 px-5 py-3 text-sm"
              >
                <div className="font-medium text-slate-900">
                  Order #{order.id}
                </div>
                <div>
                  <OrderTypeBadge type={order.type} />
                </div>
                <div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="font-medium text-slate-900">
                  ${order.total.toFixed(2)}
                </div>
                <div className="text-slate-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}