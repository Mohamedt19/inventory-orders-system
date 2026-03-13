import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../lib/api";
import type { Order, OrderStatus } from "../types";

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

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  async function loadOrder() {
    if (!id) return;
    const data = await apiRequest<Order>(`/api/orders/${id}`);
    setOrder(data);
  }

  useEffect(() => {
    loadOrder().catch(console.error);
  }, [id]);

  async function handleStatusChange(status: OrderStatus) {
    if (!id) return;

    setError("");

    try {
      await apiRequest<Order>(`/api/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      await loadOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order");
    }
  }

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm text-slate-500">Loading order...</div>
        </div>
      </div>
    );
  }

  const isLocked =
    order.status === "completed" || order.status === "cancelled";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Order Record
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Order #{order.id}
            </h1>

            <div className="mt-3 flex flex-wrap gap-2">
              <OrderTypeBadge type={order.type} />
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="mt-3 text-sm text-slate-500">
              Created: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 lg:min-w-64">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Order Total
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              ${order.total.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Status Control
          </div>

          {isLocked ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              This order is locked because it is already{" "}
              <strong>{order.status}</strong>.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => handleStatusChange("pending")}
                disabled={order.status === "pending"}
                className={
                  order.status === "pending"
                    ? "rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700"
                    : "rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                }
              >
                Pending
              </button>

              <button
                onClick={() => handleStatusChange("completed")}
                className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                Completed
              </button>

              <button
                onClick={() => handleStatusChange("cancelled")}
                className="rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Cancelled
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Order Items</h2>
          <div className="text-sm text-slate-500">
            {order.items.length} item{order.items.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <div>Product</div>
            <div>Quantity</div>
            <div>Unit Price</div>
            <div>Line Total</div>
          </div>

          {order.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center border-t border-slate-200 px-5 py-3 text-sm"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  {item.product.name}
                </div>
                <div className="text-xs text-slate-500">
                  SKU {item.product.sku}
                </div>
              </div>

              <div className="text-slate-700">{item.quantity}</div>

              <div className="text-slate-700">
                ${item.unitPrice.toFixed(2)}
              </div>

              <div className="font-semibold text-slate-900">
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}