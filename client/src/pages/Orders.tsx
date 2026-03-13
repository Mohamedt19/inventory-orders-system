import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import type { Order, OrderType, Product } from "../types";

type NewOrderItem = {
  productId: string;
  quantity: string;
};

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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [type, setType] = useState<OrderType>("sale");
  const [items, setItems] = useState<NewOrderItem[]>([
    { productId: "", quantity: "1" },
  ]);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [orderData, productData] = await Promise.all([
        apiRequest<Order[]>("/api/orders"),
        apiRequest<Product[]>("/api/products"),
      ]);

      setOrders(orderData);
      setProducts(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateItem(
    index: number,
    field: "productId" | "quantity",
    value: string
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addItemRow() {
    setItems((prev) => [...prev, { productId: "", quantity: "1" }]);
  }

  function removeItemRow(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        type,
        status: "pending",
        items: items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      };

      const newOrder = await apiRequest<Order>("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setOrders((prev) => [newOrder, ...prev]);
      setType("sale");
      setItems([{ productId: "", quantity: "1" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Order Entry
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Orders
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Create purchase and sales orders, then complete them from the order
            record to update inventory.
          </p>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            New orders start as <strong>Pending</strong>. Inventory changes only
            after the order is marked <strong>Completed</strong>.
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Order Type
              </label>
              <select
                className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                value={type}
                onChange={(e) => setType(e.target.value as OrderType)}
              >
                <option value="sale">Sale Order</option>
                <option value="purchase">Purchase Order</option>
              </select>
            </div>

            <div>
              <div className="mb-3 text-sm font-medium text-slate-700">
                Order Items
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3.5 md:grid-cols-[2fr_1fr_auto]"
                  >
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Product
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                        value={item.productId}
                        onChange={(e) =>
                          updateItem(index, "productId", e.target.value)
                        }
                      >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Quantity
                      </label>
                      <input
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItemRow(index)}
                        disabled={items.length === 1}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addItemRow}
                className="mt-3 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Add Item
              </button>
            </div>

            <div className="flex justify-start border-t border-slate-200 pt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                Create Pending Order
              </button>
            </div>
          </form>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Order Register
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {orders.length} order{orders.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-500">No orders yet.</div>
        ) : (
          <div className="overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <div>Order</div>
              <div>Type</div>
              <div>Status</div>
              <div>Total</div>
              <div>Items</div>
            </div>

            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] items-center border-t border-slate-200 px-5 py-3 text-sm hover:bg-slate-50"
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

                <div className="text-slate-600">
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}