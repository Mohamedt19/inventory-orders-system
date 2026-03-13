import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../lib/api";
import type { Product, Supplier } from "../types";

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 5) {
    return (
      <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        {stock} low
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      {stock} in stock
    </span>
  );
}

type SortField = "name" | "price" | "stock";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  async function loadData() {
    try {
      const [productData, supplierData] = await Promise.all([
        apiRequest<Product[]>("/api/products"),
        apiRequest<Supplier[]>("/api/suppliers"),
      ]);

      setProducts(productData);
      setSuppliers(supplierData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      const newProduct = await apiRequest<Product>("/api/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          sku,
          price: Number(price),
          stock: Number(stock),
          supplierId: supplierId ? Number(supplierId) : null,
        }),
      });

      setProducts((prev) => [newProduct, ...prev]);
      setName("");
      setSku("");
      setPrice("");
      setStock("");
      setSupplierId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  }

  async function handleDelete(productId: number) {
    try {
      await apiRequest(`/api/products/${productId}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function sortIndicator(field: SortField) {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  }

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());

      const matchesStock =
        stockFilter === "all"
          ? true
          : stockFilter === "low"
            ? product.stock <= 5
            : product.stock > 5;

      return matchesSearch && matchesStock;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "price") {
        comparison = a.price - b.price;
      } else if (sortField === "stock") {
        comparison = a.stock - b.stock;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [products, search, stockFilter, sortField, sortDirection]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Product Entry
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage catalog items, pricing, stock levels, and supplier mapping.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 px-5 py-5 md:grid-cols-2">
          <input
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
          />

          <input
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="SKU"
          />

          <input
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />

          <input
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock"
          />

          <select
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500 md:col-span-2"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">No supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>

          <div className="border-t border-slate-200 pt-4 md:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              Add Product
            </button>
          </div>
        </form>

        {error && (
          <div className="px-5 pb-5">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Product Register
            </h2>
            <div className="mt-1 text-sm text-slate-500">
              {filteredProducts.length} product
              {filteredProducts.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              placeholder="Search products..."
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-teal-500"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Stock</option>
              <option value="low">Low Stock</option>
              <option value="healthy">Healthy Stock</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="px-5 py-8 text-sm text-slate-500">
            No products found.
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1.1fr_1.8fr_160px] bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <button
                type="button"
                onClick={() => handleSort("name")}
                className="flex items-center gap-1 text-left"
              >
                <span>Product</span>
                <span>{sortIndicator("name")}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSort("price")}
                className="flex items-center gap-1 text-left"
              >
                <span>Price</span>
                <span>{sortIndicator("price")}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSort("stock")}
                className="flex items-center gap-1 text-left"
              >
                <span>Stock</span>
                <span>{sortIndicator("stock")}</span>
              </button>

              <div>Supplier</div>
              <div className="text-center">Actions</div>
            </div>

            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[2fr_1fr_1.1fr_1.8fr_160px] items-center border-t border-slate-200 px-5 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {product.name}
                  </div>
                  <div className="text-xs text-slate-500">SKU {product.sku}</div>
                </div>

                <div className="font-medium text-slate-900">
                  ${product.price.toFixed(2)}
                </div>

                <div>
                  <StockBadge stock={product.stock} />
                </div>

                <div className="text-slate-600 leading-5">
                  {product.supplier?.name || "No supplier"}
                </div>

                <div className="flex justify-center gap-2">
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}